import { TaskHandlerArgs, TaskInput } from "payload";


export const schedulePublish = {
    slug: 'schedulePublish',
    retries: 1,
    handler: async ({ job, req }: TaskHandlerArgs<'schedulePublish'>) => {
        const { type, doc } = job.input as TaskInput<'schedulePublish'>;
        if (!doc || (doc.relationTo !== 'pages' && doc.relationTo !== 'posts')) {
            return { output: { success: true, skipped: true } }
        }
        try {
            if (type === 'publish') {
                const item = await req.payload.findByID({
                    collection: doc.relationTo,
                    id: doc.value as number,
                    draft: true
                })

                if (!item) return { output: { success: false, skipped: true } }

                await req.payload.update({
                    collection: doc.relationTo,
                    id: doc.value as number,
                    data: {
                        _status: 'published'
                    },
                    draft: false
                })
                return { output: { success: true, skipped: true } }
            } else {
                const item = await req.payload.findByID({
                    collection: doc.relationTo,
                    id: doc.value as number,
                    draft: true
                })

                if (!item) return { output: { success: false, skipped: true } }

                await req.payload.update({
                    collection: doc.relationTo,
                    id: doc.value as number,
                    data: {
                        _status: 'draft'
                    },
                    draft: false
                })
            }
        } catch {
            return { output: { success: false, skipped: true } }
        }
    }
}