const Follow = require("../models/follow");

const followUserIds = async (identityUserId) => {
  try {
    // Sacar info de seguimiento
    let following = await Follow.find({ user: identityUserId })
      .select({ followed: 1, _id: 0 })
      .exec();

    // seguidores
    let follower = await Follow.find({ followed: identityUserId })
      .select({ user: 1, _id: 0 })
      .exec();

    // Procesara array de identificadores
    let followingClean = [];

    following.forEach((follow) => {
      followingClean.push(follow.followed);
    });

    let followersClean = [];

    follower.forEach((follow) => {
      followersClean.push(follow.user);
    });

    return {
      following: followingClean,
      followers: followersClean,
    };
  } catch (error) {
    // Manejo de errores si es necesario
    console.error(error);
    throw error;
  }
};

// Sigo a este usuario
const followThisUser = async (identityUserId, profileUserId) => {
  try {
    // Sacar info de seguimiento
    let following = await Follow.findOne({
      user: identityUserId,
      followed: profileUserId,
    });

    // seguidores
    let follower = await Follow.findOne({
      user: profileUserId,
      followed: identityUserId,
    });

    return {
      following,
      follower,
    };
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  followUserIds,
  followThisUser,
};
