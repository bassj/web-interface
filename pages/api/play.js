import {getCatalog} from '../model/catalog'
import {exec} from 'child_process'

export default async (req, res) => {
    const {
        series: series_id,
        season: season_id,
        episode: episode_id
    } = req.body;
    
    const seriesCatalog = await getCatalog();

    const series = seriesCatalog[series_id];
    const season = series.seasons[season_id];
    const episode = season.episodes[episode_id];

    console.log(episode);

    const player_command = `mplayer -ao pulse "${episode.path}"`;

    const player_proc = exec(player_command, (error, stdout, stderr) => {
        console.log("Started player");
    });

    player_proc.on('close', () => {
        console.log("Player process closed!");
    });

    //console.log(player_proc);

    console.log(player_command);

    res.json({
        success: true
    });
};
