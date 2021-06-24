import ExchangeProxyABI from '@masknet/contracts/abis/ExchangeProxy.json'
import type { ExchangeProxy } from '@masknet/contracts/types/ExchangeProxy'
import { useConstant, useContract } from '@masknet/web3-shared'
import type { AbiItem } from 'web3-utils'
import { TRADE_CONSTANTS } from '../../constants'

export function useExchangeProxyContract() {
    const { BALANCER_EXCHANGE_PROXY_ADDRESS } = useConstant(TRADE_CONSTANTS)
    return useContract<ExchangeProxy>(BALANCER_EXCHANGE_PROXY_ADDRESS, ExchangeProxyABI as AbiItem[])
}
