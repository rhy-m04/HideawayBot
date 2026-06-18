import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { logger } from '../../utils/logger.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

const BOARD_URL = 'https://www.pinterest.com/Rhy_m4/lando-norris/';
const BOARD_LINK = 'https://uk.pinterest.com/Rhy_m4/lando-norris/';

const CACHE_TTL = 10 * 60 * 1000;
let imageCache = { urls: [], fetchedAt: 0 };

async function fetchBoardImages() {
    if (imageCache.urls.length > 0 && Date.now() - imageCache.fetchedAt < CACHE_TTL) {
        return imageCache.urls;
    }

    const res = await fetch(BOARD_URL, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
            'Accept': 'text/html,application/xhtml+xml',
            'Accept-Language': 'en-US,en;q=0.9'
        },
        signal: AbortSignal.timeout(10000)
    });

    if (!res.ok) throw new Error(`Pinterest fetch failed: ${res.status}`);
    const html = await res.text();

    const seen = new Set();
    const urls = [];

    for (const match of html.matchAll(/https:\/\/i\.pinimg\.com\/[^"')]+\.jpg/g)) {
        const raw = match[0];
        const hash = raw.replace(/https:\/\/i\.pinimg\.com\/[^/]+\//, '');
        if (seen.has(hash)) continue;
        seen.add(hash);
        const full = `https://i.pinimg.com/originals/${hash}`;
        urls.push(full);
    }

    if (urls.length === 0) throw new Error('No images found on board');

    imageCache = { urls, fetchedAt: Date.now() };
    logger.debug(`[LandoNorris] Cached ${urls.length} images from Pinterest board`);
    return urls;
}

export default {
    data: new SlashCommandBuilder()
        .setName('landonorris')
        .setDescription('Sends a random Lando Norris image 🧡'),
    category: 'Fun',

    async execute(interaction) {
        try {
            await InteractionHelper.safeDefer(interaction);

            const urls = await fetchBoardImages();
            const image = urls[Math.floor(Math.random() * urls.length)];

            const embed = new EmbedBuilder()
                .setColor(0xFF8000)
                .setTitle('🧡 Lando Norris')
                .setURL(BOARD_LINK)
                .setImage(image)
                .setFooter({ text: `Image ${urls.indexOf(image) + 1} of ${urls.length} • pinterest.com` });

            await InteractionHelper.safeEditReply(interaction, { embeds: [embed] });
        } catch (err) {
            logger.error('[LandoNorris] Failed to fetch image:', err.message);
            await InteractionHelper.safeEditReply(interaction, {
                content: '❌ Couldn\'t fetch an image from the board right now. Try again in a moment.'
            });
        }
    }
};
