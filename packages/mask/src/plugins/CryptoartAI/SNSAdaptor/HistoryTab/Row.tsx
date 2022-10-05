import { truncate } from 'lodash-unified'
import { Avatar, Link, TableCell, TableRow, Typography } from '@mui/material'
import { makeStyles } from '@masknet/theme'
import type { ChainId } from '@masknet/web3-shared-evm'
import { Account } from '../Account.js'
import { resolveWebLinkOnCryptoartAI } from '../../pipes/index.js'

const useStyles = makeStyles()((theme) => {
    return {
        account: {
            display: 'flex',
            alignItems: 'center',
        },
        avatar: {
            width: 18,
            height: 18,
        },
        accountName: {
            marginLeft: theme.spacing(0.5),
        },
        relativeTime: {
            whiteSpace: 'nowrap',
        },
        token: {
            objectFit: 'contain',
            width: 18,
            height: 18,
            marginRight: theme.spacing(0.5),
        },
        content: {
            display: 'flex',
            alignItems: 'center',
        },
        ethPrice: {
            display: 'flex',
            alignItems: 'center',
            fontWeight: 700,
        },
        usdcPrice: {
            display: 'flex',
            alignItems: 'center',
            color: 'grey',
        },
    }
})

interface Props {
    event: any
    chainId: ChainId
}

export function Row({ event, chainId }: Props) {
    const { classes } = useStyles()
    return (
        <TableRow>
            <TableCell>
                <Link
                    href={resolveWebLinkOnCryptoartAI(chainId) + '/' + event.operatorName}
                    target="_blank"
                    className={classes.account}
                    rel="noopener noreferrer">
                    <Avatar src={event.avatarPath} className={classes.avatar} />
                    <Typography className={classes.accountName} variant="body2">
                        <Account
                            username={truncate(event.operatorName, {
                                length: 13,
                            })}
                            address={event.operatorAddress}
                        />
                    </Typography>
                </Link>
            </TableCell>
            <TableCell>
                <Link
                    href={event.transactionUrl}
                    title=""
                    target="_blank"
                    className={classes.account}
                    rel="noopener noreferrer">
                    <Typography className={classes.content} variant="body2">
                        {event.transactionTypeName}
                    </Typography>
                </Link>
            </TableCell>
            <TableCell>
                <Typography className={classes.content} variant="body2">
                    {event.createTime.slice(0, Math.max(0, event.createTime.length - 3))}
                </Typography>
            </TableCell>
            <TableCell>
                <Typography className={classes.ethPrice} variant="body2">
                    {event.priceInEth} &Xi;
                </Typography>
                <Typography className={classes.usdcPrice} variant="body2">
                    (${event.priceInUsd})
                </Typography>
            </TableCell>
        </TableRow>
    )
}
