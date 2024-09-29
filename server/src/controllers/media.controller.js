import responseHandler from "../handler/response.handler.js";
import tmbdApi from "../tmdb/tmdb.api.js";
import userModel from "../models/user.model.js";
import favoriteModel from "../models/favorite.model.js";
import reviewModel from "../models/model.options.js";
import { response } from "express";
import tokenMiddleware from "../middlewares/token.middleware.js";

const getList = async (req, res) => {
    try {
        const { page } = req.query;
        const { mediaType, mediaCategory } = req.params;

        const response = await tmbdApi.mediaList({
            mediaType,
            mediaCategory,
            page,
        });

        return responseHandler.ok(res, response);
    } catch {
        responseHandler.error(res);
    }
};

const getGenres = async (req, res) => {
    try {
        const { mediaType } = req.params;

        const response = await tmbdApi.mediaGenres({ mediaType });

        return responseHandler.ok(res, response);
    } catch {
        responseHandler.error(res);
    }
};

const search = async (req, res) => {
    try {
        const { mediaType } = req.params;
        const { query, page } = req.query;

        const response = await tmbdApi.mediaSearch({
            query,
            page,
            mediaType: mediaType === "people" ? "person" : mediaType,
        });

        responseHandler.ok(res, response);
    } catch {
        responseHandler.error(res);
    }
};

const getDetail = async (req, res) => {
    try {
        const { mediaType, mediaId } = req.params;
        const params = { mediaType, mediaId };
        const media = await tmbdApi.mediaDetail({ mediaType, mediaId });
        media.credits = await tmbdApi.mediaCredits({ params });
        const videos = await tmbdApi.mediaVideos(params);
        media.videos = videos;
        const recommend = recommend.results;

        media.images = await tmbdApi.mediaImages(params);

        const tokenDecoded = tokenMiddleware.tokenDecode(req);

        if (tokenDecoded) {
            const user = await userModel.findById(tokenDecoded.data);
            if (user) {
                const isFavorite = await favoriteModel.findOne({
                    user: user.id,
                    mediaId,
                });
                media.isFavorite = isFavorite !== null;
            }
        }

        media.reviews = await reviewModel
            .find({ mediaId })
            .populate("user")
            .sort("-createdAt");

        responseHandler.ok(res, media);
    } catch {
        responseHandler.error(res);
    }
};

export default {
    getList,
    getGenres,
    search,
    getDetail,
};
