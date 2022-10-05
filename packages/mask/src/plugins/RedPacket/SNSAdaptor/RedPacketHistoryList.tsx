import { Typography, List, Box } from '@mui/material'
import { makeStyles, LoadingBase } from '@masknet/theme'
import type { RedPacketJSONPayload } from '../types.js'
import { RedPacketInHistoryList } from './RedPacketInHistoryList.js'
import { useRedPacketHistory } from './hooks/useRedPacketHistory.js'
import { useI18N } from '../locales/index.js'
import { useAccount, useChainId } from '@masknet/web3-hooks-base'
import { NetworkPluginID } from '@masknet/web3-shared-base'
import { Icons } from '@masknet/icons'

const useStyles = makeStyles()((theme) => {
    const smallQuery = `@media (max-width: ${theme.breakpoints.values.sm}px)`
    return {
        root: {
            display: 'flex',
            padding: 0,
            boxSizing: 'border-box',
            height: '100%',
            flexDirection: 'column',
            margin: '0 auto',
            overflow: 'auto',
            [smallQuery]: {
                padding: 0,
            },
            '&::-webkit-scrollbar': {
                display: 'none',
            },
        },
        placeholder: {
            display: 'flex',
            flexDirection: 'column',
            height: 240,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            width: 360,
            margin: '0 auto',
        },
        emptyIcon: {
            width: 36,
            height: 36,
            marginBottom: 13,
        },
    }
})

interface RedPacketHistoryListProps {
    onSelect: (payload: RedPacketJSONPayload) => void
}

export function RedPacketHistoryList(props: RedPacketHistoryListProps) {
    const { onSelect } = props
    const t = useI18N()
    const { classes } = useStyles()
    const account = useAccount(NetworkPluginID.PLUGIN_EVM)
    const chainId = useChainId(NetworkPluginID.PLUGIN_EVM)
    const { value: histories, loading } = useRedPacketHistory(account, chainId)

    if (loading) {
        return (
            <Box style={{ height: 240, alignItems: 'center', display: 'flex', justifyContent: 'center' }}>
                <LoadingBase />
            </Box>
        )
    }

    if (!histories?.length) {
        return (
            <Typography className={classes.placeholder} color="textSecondary">
                <Icons.EmptySimple className={classes.emptyIcon} />
                {t.token_no_history()}
            </Typography>
        )
    }

    return (
        <div className={classes.root}>
            <List style={{ padding: '16px 0 0' }}>
                {histories.map((history, i) => (
                    <RedPacketInHistoryList key={i} history={history} onSelect={onSelect} />
                ))}
            </List>
        </div>
    )
}
