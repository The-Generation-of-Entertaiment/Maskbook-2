import { Box } from '@mui/system'
import { SourceSwitcher } from '@masknet/shared'
import { makeStyles } from '@masknet/theme'
import { useContext } from 'react'
import type { Web3Helper } from '@masknet/web3-helpers'
import { Stack, Typography } from '@mui/material'
import { useI18N } from '../../../../utils/index.js'
import { TrendingViewContext } from './context.js'
import { PluginDescriptor } from './PluginDescriptor.js'
import { uniqBy } from 'lodash-es'

const useStyles = makeStyles<{
    isTokenTagPopper: boolean
    isNFTProjectPopper: boolean
}>()((theme, props) => {
    return {
        source: {
            display: 'flex',
            justifyContent: 'space-between',
        },
        sourceNote: {
            color: theme.palette.maskColor.secondaryDark,
            marginRight: 4,
            fontWeight: 700,
        },
        sourceMenu: {
            fontSize: 14,
            fontWeight: 700,
        },
        selectedOption: {
            fontWeight: 700,
            color:
                props.isNFTProjectPopper || props.isTokenTagPopper
                    ? theme.palette.maskColor.main
                    : theme.palette.maskColor.dark,
        },
    }
})

export interface TrendingViewDescriptorProps {
    result: Web3Helper.TokenResultAll
    resultList: Web3Helper.TokenResultAll[]
    setResult: (a: Web3Helper.TokenResultAll) => void
}

export function TrendingViewDescriptor(props: TrendingViewDescriptorProps) {
    const { result, resultList, setResult } = props
    const { isProfilePage, isNFTProjectPopper = false, isTokenTagPopper = true } = useContext(TrendingViewContext)
    const { t } = useI18N()

    const { classes } = useStyles({ isTokenTagPopper, isNFTProjectPopper })

    const displayList = uniqBy(
        resultList.filter((x) => x.type === result.type),
        (x) => x.source,
    )

    return (
        <PluginDescriptor
            isNFTProjectPopper={isNFTProjectPopper}
            isProfilePage={isProfilePage}
            isTokenTagPopper={isTokenTagPopper}>
            <Box className={classes.source}>
                {displayList.length > 1 && (
                    <>
                        <Stack
                            className={classes.sourceMenu}
                            display="inline-flex"
                            flexDirection="row"
                            alignItems="center"
                            gap={0.5}>
                            <Typography className={classes.sourceNote}>{t('powered_by')}</Typography>
                        </Stack>
                        <SourceSwitcher
                            resultList={displayList}
                            result={result}
                            setResult={setResult}
                            classes={{ selectedOption: classes.selectedOption }}
                        />
                    </>
                )}
            </Box>
        </PluginDescriptor>
    )
}