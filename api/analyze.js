export default async function handler(req, res) {
    // 1. Allow only POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
        // 2. Validate Inputs
        const { username } = req.body;
        if (!username) return res.status(400).json({ error: "Username required" });

        // Remove the '@' if the user typed it
        const cleanUsername = username.replace('@', '').trim();

        // 3. Check for API Key (Prevents 502 Crashes)
        const token = process.env.X_BEARER_TOKEN;
        if (!token) {
            console.error("CRITICAL: X_BEARER_TOKEN is missing in Vercel Environment Variables.");
            return res.status(500).json({ error: "Server Configuration Error: Missing API Token" });
        }

        // 4. CALL X API (Using Native Fetch - No Library Needed)
        const xUrl = `https://twitter.com{cleanUsername}?user.fields=public_metrics,description,verified`;
        
        const xResponse = await fetch(xUrl, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        // Handle X API Errors gracefully
        if (!xResponse.ok) {
            const errData = await xResponse.json();
            console.error("X API Error:", errData);
            // If 404, user doesn't exist
            if (xResponse.status === 404) {
                return res.status(404).json({ error: `User @${cleanUsername} not found on X.` });
            }
            // If 429, rate limited
            if (xResponse.status === 429) {
                return res.status(429).json({ error: "X API Rate Limit Reached. Try again in 15 mins." });
            }
            throw new Error(`X API connection failed: ${xResponse.statusText}`);
        }

        const xData = await xResponse.json();
        const user = xData.data;
        const metrics = user.public_metrics;

        // 5. Run "AI" Analysis Logic (Rule-Based Engine)
        // We calculate a real score based on the ACTUAL follower/following ratio
        const ratio = metrics.following_count > 0 ? (metrics.followers_count / metrics.following_count) : 0;
        let vibeScore = Math.min(Math.floor(ratio * 10) + 40, 98); 
        if (user.verified) vibeScore += 5;

        // Detect Niche from Bio
        const bio = user.description.toLowerCase();
        let strategyBadge = "General Growth Vector";
        let nicheRecommendations = [];

        if (bio.includes("crypto") || bio.includes("web3") || bio.includes("btc") || bio.includes("eth")) {
            strategyBadge = "Web3 Community Architect";
            nicheRecommendations = [
                { type: "The Alpha Leak", text: `Stop chasing 100x pumps.\n\nI just analyzed the on-chain volume for ${cleanUsername}'s top holding.\n\nThe real money isn't in trading. It's in building infrastructure.` },
                { type: "The Bear Market Builder", text: "Tourists leave when the chart goes red.\n\nBuilders like us verify contracts while they panic sell.\n\nSee you at the ATH." }
            ];
        } else if (bio.includes("build") || bio.includes("dev") || bio.includes("saas") || bio.includes("code")) {
            strategyBadge = "SaaS Product Engine";
            nicheRecommendations = [
                { type: "The Shipping Hook", text: `I deployed to prod on a Friday.\n\nHere is the exact tech stack that lets me sleep at night:\n\n1. Vercel\n2. Supabase\n3. Qwen\n\nSpeed is the only moat.` },
                { type: "The Anti-Tutorial", text: "Stop watching tutorials. Start breaking production.\n\nYou don't learn by reading docs. You learn by fixing 502 errors." }
            ];
        } else {
            // Default "Bangers"
            nicheRecommendations = [
                { type: "The Hot Take", text: `Unpopular opinion:\n\nMost people on this app are overthinking their content strategy.\n\nJust post the work.` },
                { type: "The Value Thread", text: `How I gained ${metrics.followers_count} followers in 30 days (without buying ads):\n\n1. Reply to big accounts\n2. Post 2x daily\n3. Don't be boring.` }
            ];
        }

        // 6. Return Clean JSON
        return res.status(200).json({
            username: user.username,
            followerCount: metrics.followers_count,
            followingCount: metrics.following_count,
            tweetCount: metrics.tweet_count,
            strategyBadge: strategyBadge,
            hookRating: vibeScore,
            failureDiagnosis: ratio < 1 ? "Your Following/Follower ratio is negative. Stop following randoms and start posting authority content." : "Your engagement is solid, but you need more high-impact threads.",
            suggestedPosts: nicheRecommendations
        });

    } catch (error) {
        console.error("Backend Crash:", error);
        return res.status(500).json({ 
            error: "System Analysis Failed", 
            details: error.message 
        });
    }
}
