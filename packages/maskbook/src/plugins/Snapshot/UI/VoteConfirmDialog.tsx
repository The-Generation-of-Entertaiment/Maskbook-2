import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Link,
    DialogContent,
    DialogActions,
    CircularProgress,
    createStyles,
    makeStyles,
} from '@material-ui/core'
import millify from 'millify'
import OpenInNew from '@material-ui/icons/OpenInNew'
import type { ProposalMessage } from '../types'
import { resolveBlockLinkOnEtherscan } from '../../../web3/pipes'
import { useI18N } from '../../../utils/i18n-next-ui'
import { InjectedDialog } from '../../../components/shared/InjectedDialog'
import { ChainId } from '../../../web3/types'
import { InfoField } from './InformationCard'
import { EthereumWalletConnectedBoundary } from '../../../web3/UI/EthereumWalletConnectedBoundary'

const useStyles = makeStyles((theme) =>
    createStyles({
        card: {
            padding: 0,
            border: `solid 1px ${theme.palette.divider}`,
            margin: `${theme.spacing(2)} auto`,
        },
        content: {
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxSizing: 'border-box',
        },
        button: {
            width: '60%',
            minHeight: 39,
            margin: `${theme.spacing(1)} auto`,
        },
        link: {
            display: 'flex',
            color: 'inherit',
            alignItems: 'center',
            marginLeft: theme.spacing(1),
            textDecoration: 'none !important',
        },
        loading: {
            color: theme.palette.text.primary,
        },
    }),
)

interface VoteConfirmDialogProps {
    open: boolean
    loading: boolean
    message: ProposalMessage
    onClose: () => void
    onVoteConfirm: () => void
    choiceText: string
    power: number | undefined
}

export function VoteConfirmDialog(props: VoteConfirmDialogProps) {
    const { open, onClose, onVoteConfirm, choiceText, message, power = 0, loading } = props
    const { t } = useI18N()
    const classes = useStyles()

    return (
        <InjectedDialog
            open={open}
            onClose={onClose}
            title={t('plugin_snapshot_vote_confirm_dialog_title')}
            disableBackdropClick>
            <DialogContent>
                <Box>
                    <Typography variant="h6" align="center">
                        {t('plugin_snapshot_vote_confirm_dialog_choice', { choiceText })}
                    </Typography>
                    <Typography variant="h6" align="center">
                        {t('plugin_snapshot_vote_confirm_dialog_warning')}
                    </Typography>
                </Box>
                <Card className={classes.card} variant="outlined">
                    <CardContent className={classes.content}>
                        <Box>
                            <InfoField title={t('plugin_snapshot_vote_choice')}>{choiceText}</InfoField>
                            <InfoField title={t('plugin_snapshot_info_snapshot')}>
                                <Link
                                    className={classes.link}
                                    target="_blank"
                                    rel="noopener"
                                    href={resolveBlockLinkOnEtherscan(ChainId.Mainnet, message.payload.snapshot)}>
                                    {message.payload.snapshot}
                                    <OpenInNew fontSize="small" />
                                </Link>
                            </InfoField>
                            <InfoField title={t('plugin_snapshot_vote_power')}>
                                {`${millify(power, { precision: 2, lowercase: true })} ${message.space.toUpperCase()}`}
                            </InfoField>
                        </Box>
                    </CardContent>
                </Card>
            </DialogContent>
            <DialogActions>
                <EthereumWalletConnectedBoundary
                    offChain={true}
                    classes={{ connectWallet: classes.button, unlockMetaMask: classes.button }}>
                    <Button
                        classes={{ root: classes.button }}
                        color="primary"
                        variant="contained"
                        fullWidth
                        onClick={onVoteConfirm}>
                        {loading ? (
                            <CircularProgress size={16} className={classes.loading} />
                        ) : (
                            t('plugin_snapshot_vote')
                        )}
                    </Button>
                </EthereumWalletConnectedBoundary>
            </DialogActions>
        </InjectedDialog>
    )
}