import { useState } from 'react'
import type { Plugin } from '@masknet/plugin-infra'
import { TargetChainIdContext } from '@masknet/web3-hooks-evm'
import { ApplicationEntry } from '@masknet/shared'
import { Icons } from '@masknet/icons'
import { PluginI18NFieldRender } from '@masknet/plugin-infra/content-script'
import { base } from '../base.js'
import { ApprovalDialog } from './ApprovalDialog.js'

const sns: Plugin.SNSAdaptor.Definition = {
    ...base,
    init(signal) {},
    ApplicationEntries: [
        (() => {
            const icon = <Icons.Approval size={36} />
            const name = { i18nKey: 'plugin_name', fallback: 'Approval' }
            const iconFilterColor = 'rgba(251, 176, 59, 0.3)'
            return {
                ApplicationEntryID: base.ID,
                RenderEntryComponent(EntryComponentProps) {
                    const [open, setOpen] = useState(false)
                    const clickHandler = () => setOpen(true)
                    return (
                        <>
                            <ApplicationEntry
                                {...EntryComponentProps}
                                title={<PluginI18NFieldRender field={name} pluginID={base.ID} />}
                                iconFilterColor={iconFilterColor}
                                icon={icon}
                                onClick={
                                    EntryComponentProps.onClick
                                        ? () => EntryComponentProps.onClick?.(clickHandler)
                                        : clickHandler
                                }
                            />
                            {open ? (
                                <TargetChainIdContext.Provider>
                                    <ApprovalDialog open onClose={() => setOpen(false)} />
                                </TargetChainIdContext.Provider>
                            ) : null}
                        </>
                    )
                },
                appBoardSortingDefaultPriority: 6,
                icon,
                name,
                iconFilterColor,
            }
        })(),
    ],
}

export default sns
