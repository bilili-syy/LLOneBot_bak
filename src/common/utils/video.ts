import {log} from "./log";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import {getConfigUtil} from "../config";

const defaultVideoThumbB64 = "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"

export const defaultVideoThumb = Buffer.from(defaultVideoThumbB64, 'base64')

export async function getVideoInfo(filePath: string) {
    const size = fs.statSync(filePath).size;
    return new Promise<{
        width: number,
        height: number,
        time: number,
        format: string,
        size: number,
        filePath: string
    }>((resolve, reject) => {
        let ffmpegPath = getConfigUtil().getConfig().ffmpeg
        ffmpegPath && ffmpeg.setFfmpegPath(ffmpegPath)
        ffmpeg(filePath).ffprobe((err, metadata) => {
            if (err) {
                reject(err);
            } else {
                const videoStream = metadata.streams.find(s => s.codec_type === 'video');
                if (videoStream) {
                    console.log(`视频尺寸: ${videoStream.width}x${videoStream.height}`);
                } else {
                    console.log('未找到视频流信息。');
                }
                resolve({
                    width: videoStream.width, height: videoStream.height,
                    time: parseInt(videoStream.duration),
                    format: metadata.format.format_name,
                    size,
                    filePath
                });
            }
        });
    })
}

export async function encodeMp4(filePath: string) {
    let videoInfo = await getVideoInfo(filePath);
    log("视频信息", videoInfo)
    if (videoInfo.format.indexOf("mp4") === -1) {
        log("视频需要转换为MP4格式", filePath)
        // 转成mp4
        const newPath: string = await new Promise<string>((resolve, reject) => {
            const newPath = filePath + ".mp4"
            ffmpeg(filePath)
                .toFormat('mp4')
                .on('error', (err) => {
                    reject(`转换视频格式失败: ${err.message}`);
                })
                .on('end', () => {
                    log('视频转换为MP4格式完成');
                    resolve(newPath); // 返回转换后的文件路径
                })
                .save(newPath);
        });
        return await getVideoInfo(newPath)
    }
    return videoInfo
}

export function checkFfmpeg(newPath: string = null): Promise<boolean> {
    return new Promise((resolve, reject) => {
        log("开始检查ffmpeg", newPath);
        if (newPath) {
            ffmpeg.setFfmpegPath(newPath);
        }
        try {
            ffmpeg.getAvailableFormats((err, formats) => {
                if (err) {
                    log('ffmpeg is not installed or not found in PATH:', err);
                    resolve(false)
                } else {
                    log('ffmpeg is installed.');
                    resolve(true);
                }
            })
        } catch (e) {
            resolve(false);
        }
    });
}