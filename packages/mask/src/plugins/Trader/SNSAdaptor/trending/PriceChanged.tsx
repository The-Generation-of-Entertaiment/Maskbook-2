import { makeStyles } from '@masknet/theme'
import { Stack, Typography, useTheme } from '@mui/material'
import { Icons } from '@masknet/icons'

const useStyles = makeStyles()({
    value: {
        fontSize: 12,
        lineHeight: '16px',
        fontWeight: 700,
    },
})

export interface PriceChangedProps {
    amount: number
}

export function PriceChanged(props: PriceChangedProps) {
    const { classes } = useStyles()
    const colors = useTheme().palette.maskColor
    if (props.amount === 0) return null
    return (
        <Stack alignItems="center" direction="row">
            {props.amount > 0 ? <Icons.ArrowDrop size={16} style={{ transform: 'rotate(180deg)' }} /> : null}
            {props.amount < 0 ? <Icons.ArrowDrop size={16} /> : null}
            <Typography className={classes.value} color={props.amount > 0 ? colors?.success : colors?.danger}>
                {props.amount.toFixed(2)}%
            </Typography>
        </Stack>
    )
}
