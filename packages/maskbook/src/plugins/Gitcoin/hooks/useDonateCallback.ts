import { useCallback, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import type { PayableTx } from '@masknet/contracts/types/types'
import {
    FungibleTokenDetailed,
    EthereumTokenType,
    TransactionEventType,
    useConstant,
    TransactionStateType,
    useTransactionState,
    useAccount,
    useWeb3,
    useNonce,
    useGasPrice,
} from '@masknet/web3-shared'
import { GITCOIN_CONSTANT } from '../constants'
import { useBulkCheckoutContract } from '../contracts/useBulkCheckoutWallet'

/**
 * A callback for donate gitcoin grant
 * @param address the donor address
 * @param amount
 * @param token
 */
export function useDonateCallback(address: string, amount: string, token?: FungibleTokenDetailed) {
    const { GITCOIN_ETH_ADDRESS, GITCOIN_TIP_PERCENTAGE } = useConstant(GITCOIN_CONSTANT)
    const bulkCheckoutContract = useBulkCheckoutContract()

    const web3 = useWeb3()
    const account = useAccount()
    const nonce = useNonce()
    const gasPrice = useGasPrice()
    const [donateState, setDonateState] = useTransactionState()

    const donations = useMemo(() => {
        const tipAmount = new BigNumber(GITCOIN_TIP_PERCENTAGE / 100).multipliedBy(amount)
        const grantAmount = new BigNumber(amount).minus(tipAmount)
        if (!address || !token) return []
        return [
            [
                token.type === EthereumTokenType.Native ? GITCOIN_ETH_ADDRESS : token.address, // token
                tipAmount.toFixed(), // amount
                address, // dest
            ],
            [
                token.type === EthereumTokenType.Native ? GITCOIN_ETH_ADDRESS : token.address, // token
                grantAmount.toFixed(), // amount
                address, // dest
            ],
        ] as [string, string, string][]
    }, [address, amount, token])

    const donateCallback = useCallback(async () => {
        if (!token || !bulkCheckoutContract || !donations.length) {
            setDonateState({
                type: TransactionStateType.UNKNOWN,
            })
            return
        }

        // start waiting for provider to confirm tx
        setDonateState({
            type: TransactionStateType.WAIT_FOR_CONFIRMING,
        })

        // estimate gas and compose transaction
        const value = new BigNumber(token.type === EthereumTokenType.Native ? amount : 0).toFixed()
        const config = {
            from: account,
            nonce,
            gas: await bulkCheckoutContract.methods
                .donate(donations)
                .estimateGas({
                    from: account,
                    value,
                })
                .catch((error) => {
                    setDonateState({
                        type: TransactionStateType.FAILED,
                        error,
                    })
                    throw error
                }),
            gasPrice,
            value,
        }

        // send transaction and wait for hash
        return new Promise<string>((resolve, reject) => {
            bulkCheckoutContract.methods
                .donate(donations)
                .send(config as PayableTx)
                .on(TransactionEventType.TRANSACTION_HASH, (hash) => {
                    setDonateState({
                        type: TransactionStateType.HASH,
                        hash,
                    })
                    resolve(hash)
                })
                .on(TransactionEventType.ERROR, (error) => {
                    setDonateState({
                        type: TransactionStateType.FAILED,
                        error,
                    })
                    reject(error)
                })
        })
    }, [web3, nonce, gasPrice, account, amount, token, donations])

    const resetCallback = useCallback(() => {
        setDonateState({
            type: TransactionStateType.UNKNOWN,
        })
    }, [])

    return [donateState, donateCallback, resetCallback] as const
}
