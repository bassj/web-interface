const fs = require('fs').promises;
import path from 'path'
//import fs from 'fs.promises'  

/*const seriesCatalog = [];

function catalogSeason(season_path, season_name, series) {
    const season_id = series.seasons.length;
    
    const season = {
        id: season_id,
        name: season_name,
        episodes: []
    };

    series.seasons.push(season);

    fs.readdir(season_path, function (err, files) {
        if (err) {
            console.error(err);
            return;
        }

        files.forEach(function (file) {
            const episodePath = path.join(season_path, file);

            if (!fs.lstatSync(episodePath).isFile()) {
                return;
            }

            season.episodes.push(
                { path: episodePath }
            );
        });
    });

}

function catalogSeries(series_path, name) {
    const id = seriesCatalog.length;

    const series = {
        id,
        name,
        seasons: []
    };

    seriesCatalog.push(series);

    fs.readdir(series_path, function (err, files) {
        if (err) {
            console.error(err);
            return;
        }

        files.forEach(function (file) {
            const seasonPath = path.join(series_path, file);
            catalogSeason(seasonPath, file, series);
        });
    });
}

function catalogDirectory(err, files) {
    if (err) {
        console.error(err);
        return;
    }

    async.each(files, function (file, done) {
        const seriesPath = path.join(media_dir, file);

        if (!fs.lstatSync(seriesPath).isDirectory()) {
            return done();
        }

        catalogSeries(seriesPath, file);

        done();
    }).catch(console.error);
}*/

const media_dir = '/mnt/elephant/media';

const catalog = [];

async function catalogEpisodes(season, season_path) {
    const episodes = await fs.readdir(season_path);

    for (const e in episodes) {
        const episode_name = episodes[e];
        const episode_path = path.join(season_path, episode_name);

        const episode = {
            id: e,
            path: episode_path
        };

        season.episodes.push(episode);
    }
}

async function catalogSeasons(series, series_path) {
    const seasons = await fs.readdir(series_path);

    for (const s in seasons) {
        const season_name = seasons[s];

        const season = {
            id: s,
            name: season_name,
            episodes: []
        };

        const season_path = path.join(series_path, season.name);

        await catalogEpisodes(season, season_path);

        series.seasons.push(season);
    }
}

async function addSeries(series_name) {
    const series_path = path.join(media_dir, series_name);

    const id = catalog.length;

    const series = {
        id,
        name: series_name,
        seasons: []
    };

    await catalogSeasons(series, series_path);

    catalog.push(series);
}

export async function updateCatalog() {
    const series = await fs.readdir(media_dir);
    
    for (const s in series) {
        await addSeries(series[s]);
    }
}

export async function getCatalog() {
    if (catalog.length == 0) {
        await updateCatalog();
    }

    return catalog;
}