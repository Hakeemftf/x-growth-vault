import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return res.status(500).json({ error: "Cloud database keys are unconfigured in environment." });
    }

    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    try {
        const { data: pendingPosts, error: queryError } = await supabase
            .from('scheduled_posts')
            .select('id, post_content, creator_id')
            .eq('status', 'pending');

        if (queryError) throw queryError;
        if (!pendingPosts || pendingPosts.length === 0) {
            return res.status(200).json({ status: "Success", message: "Deployment queue clear." });
        }

        const manifest = [];
        for (const post of pendingPosts) {
            try {
                await supabase.from('scheduled_posts').update({ status: 'posted', updated_at: new Date() }).eq('id', post.id);
                manifest.push({ id: post.id, status: "DISPATCHED" });
            } catch (err) {
                await supabase.from('scheduled_posts').update({ status: 'failed', updated_at: new Date() }).eq('id', post.id);
                manifest.push({ id: post.id, status: "FAILED" });
            }
        }
        return res.status(200).json({ status: "Batch Finalized", manifest });
    } catch (globalException) {
        return res.status(500).json({ error: "Processing loop collapsed." });
    }
}
