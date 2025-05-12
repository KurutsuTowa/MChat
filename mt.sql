/*
 Navicat Premium Data Transfer

 Source Server         : de
 Source Server Type    : MySQL
 Source Server Version : 80035
 Source Host           : localhost:3306
 Source Schema         : mt

 Target Server Type    : MySQL
 Target Server Version : 80035
 File Encoding         : 65001

 Date: 15/11/2024 18:09:44
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for emoji_shop
-- ----------------------------
DROP TABLE IF EXISTS `emoji_shop`;
CREATE TABLE `emoji_shop`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `icon` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `dir` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `prefix` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `prefix_end` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `suffix` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `length` int(0) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of emoji_shop
-- ----------------------------
INSERT INTO `emoji_shop` VALUES (1, '主播女孩重度依赖', '/icon.jpg', 'NEEDYGIRL', 'girl', NULL, 'avif', 8);

-- ----------------------------
-- Table structure for friend
-- ----------------------------
DROP TABLE IF EXISTS `friend`;
CREATE TABLE `friend`  (
  `friend_relation_id` int(0) NOT NULL AUTO_INCREMENT,
  `user_id` int(0) NOT NULL COMMENT '用户id',
  `friend_id` int(0) NULL DEFAULT NULL COMMENT '好友id',
  `remark` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '好友备注',
  `room_id` int(0) NULL DEFAULT NULL COMMENT '房间号',
  `unread_msg_count` int(0) NOT NULL DEFAULT 0 COMMENT '未读信息数量',
  `top_up` tinyint(0) NULL DEFAULT 0 COMMENT '好友置顶',
  `no_disturb` tinyint(0) NULL DEFAULT 0 COMMENT '免打扰',
  `ignored` tinyint(0) NULL DEFAULT 0 COMMENT '忽略',
  `like` tinyint(0) NULL DEFAULT NULL COMMENT '特别关心',
  `space_auth` enum('allow','noPass','default') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'default' COMMENT '对方访问自己个人空间的权限',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '修改时间',
  PRIMARY KEY (`friend_relation_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 59 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of friend
-- ----------------------------
INSERT INTO `friend` VALUES (1, 10001, 10002, '阿罗', 2, 0, 0, 0, 0, NULL, 'default', '2024-04-12 15:22:18', '2024-11-12 10:59:49');
INSERT INTO `friend` VALUES (2, 10002, 10001, NULL, 2, 0, NULL, NULL, NULL, NULL, 'default', '2024-04-12 15:22:23', '2024-11-12 05:57:16');
INSERT INTO `friend` VALUES (3, 10001, 10003, '普拉1123', 3, 0, 0, 0, 0, NULL, 'default', '2024-04-12 15:22:18', '2024-11-12 11:00:21');
INSERT INTO `friend` VALUES (4, 10003, 10001, NULL, 3, 0, 0, 0, 1, NULL, 'default', '2024-04-25 22:46:46', '2024-11-12 10:59:09');
INSERT INTO `friend` VALUES (5, 10001, 10004, NULL, 4, 0, 1, 0, NULL, NULL, 'default', '2024-04-25 22:46:50', '2024-11-06 22:47:42');
INSERT INTO `friend` VALUES (6, 10004, 10001, NULL, 4, 0, NULL, NULL, NULL, NULL, 'default', '2024-04-25 22:46:53', '2024-11-10 20:59:27');
INSERT INTO `friend` VALUES (11, 10006, 10003, NULL, 6, 0, NULL, NULL, NULL, NULL, 'default', '2024-06-17 08:54:45', '2024-11-10 20:59:27');
INSERT INTO `friend` VALUES (12, 10003, 10006, NULL, 6, 0, NULL, NULL, NULL, NULL, 'default', '2024-06-17 08:54:45', '2024-11-06 22:47:42');
INSERT INTO `friend` VALUES (13, 10008, 10001, NULL, 10, 0, NULL, NULL, NULL, NULL, 'default', '2024-06-19 18:23:13', '2024-11-12 11:01:58');
INSERT INTO `friend` VALUES (14, 10001, 10008, NULL, 10, 0, 1, 1, 0, NULL, 'default', '2024-06-19 18:23:13', '2024-11-12 06:35:40');
INSERT INTO `friend` VALUES (49, 10009, 10001, '枢都永远', 53, 0, 0, 0, 0, NULL, 'default', '2024-11-03 13:59:46', '2024-11-10 22:19:46');
INSERT INTO `friend` VALUES (50, 10001, 10009, 'miyako', 53, 0, 0, 0, 0, NULL, 'allow', '2024-11-03 13:59:46', '2024-11-10 18:48:54');
INSERT INTO `friend` VALUES (55, 10017, 10003, '', 64, 0, 0, 0, 0, NULL, 'default', '2024-11-12 10:10:05', '2024-11-12 10:11:45');
INSERT INTO `friend` VALUES (56, 10003, 10017, '2222adwadwada', 64, 0, 0, 0, 0, NULL, 'default', '2024-11-12 10:10:05', '2024-11-12 10:13:51');
INSERT INTO `friend` VALUES (57, 10005, 10001, '', 65, 0, 0, 0, 0, NULL, 'default', '2024-11-12 10:56:16', '2024-11-12 10:56:16');
INSERT INTO `friend` VALUES (58, 10001, 10005, '圣娅', 65, 0, 0, 0, 0, NULL, 'allow', '2024-11-12 10:56:16', '2024-11-12 10:57:01');

-- ----------------------------
-- Table structure for friend_group
-- ----------------------------
DROP TABLE IF EXISTS `friend_group`;
CREATE TABLE `friend_group`  (
  `friend_group_id` int(0) NOT NULL AUTO_INCREMENT,
  `user_id` int(0) NULL DEFAULT NULL COMMENT '创建该分组的用户',
  `friend_group_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '该分组名称',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  PRIMARY KEY (`friend_group_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of friend_group
-- ----------------------------
INSERT INTO `friend_group` VALUES (1, 10001, '学生', '2024-11-02 15:13:07');
INSERT INTO `friend_group` VALUES (2, 10001, '非常好朋友', '2024-11-02 15:13:19');
INSERT INTO `friend_group` VALUES (3, 10001, '同志', '2024-11-02 15:15:57');
INSERT INTO `friend_group` VALUES (4, 10001, '苏维埃集团123', '2024-11-02 21:32:51');
INSERT INTO `friend_group` VALUES (19, 10009, 'miyako的分组', '2024-11-03 13:34:40');
INSERT INTO `friend_group` VALUES (20, 10009, 'demo', '2024-11-03 13:40:17');
INSERT INTO `friend_group` VALUES (21, 10006, '白字的分组', '2024-11-03 23:26:53');
INSERT INTO `friend_group` VALUES (22, 10003, '普拉娜的分组111', '2024-11-12 00:43:26');
INSERT INTO `friend_group` VALUES (23, 10008, '伊吕波的', '2024-11-12 00:52:04');
INSERT INTO `friend_group` VALUES (24, 10003, 'awdawd', '2024-11-12 09:51:10');
INSERT INTO `friend_group` VALUES (25, 10001, 'abcda', '2024-11-12 10:54:15');

-- ----------------------------
-- Table structure for friend_group_list
-- ----------------------------
DROP TABLE IF EXISTS `friend_group_list`;
CREATE TABLE `friend_group_list`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `friend_relation_id` int(0) NULL DEFAULT NULL COMMENT '好友关联id',
  `friend_group_id` int(0) NULL DEFAULT NULL COMMENT '好友分组id',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 37 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of friend_group_list
-- ----------------------------
INSERT INTO `friend_group_list` VALUES (1, 1, 1);
INSERT INTO `friend_group_list` VALUES (2, 3, 2);
INSERT INTO `friend_group_list` VALUES (6, 1, 4);
INSERT INTO `friend_group_list` VALUES (20, 3, 4);
INSERT INTO `friend_group_list` VALUES (21, 5, 4);
INSERT INTO `friend_group_list` VALUES (22, 48, 4);
INSERT INTO `friend_group_list` VALUES (25, 5, 3);
INSERT INTO `friend_group_list` VALUES (26, 14, 3);
INSERT INTO `friend_group_list` VALUES (27, 3, 3);
INSERT INTO `friend_group_list` VALUES (28, 49, 19);
INSERT INTO `friend_group_list` VALUES (29, 50, 1);
INSERT INTO `friend_group_list` VALUES (30, 50, 3);
INSERT INTO `friend_group_list` VALUES (31, 11, 21);
INSERT INTO `friend_group_list` VALUES (32, 49, 20);
INSERT INTO `friend_group_list` VALUES (33, 12, 22);
INSERT INTO `friend_group_list` VALUES (34, 13, 23);
INSERT INTO `friend_group_list` VALUES (36, 5, 25);

-- ----------------------------
-- Table structure for friend_request
-- ----------------------------
DROP TABLE IF EXISTS `friend_request`;
CREATE TABLE `friend_request`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `sender_id` int(0) NULL DEFAULT NULL COMMENT '发起好友请求的用户id',
  `receiver_id` int(0) NULL DEFAULT NULL COMMENT '接收好友请求的用户id',
  `introduce` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '发起方的介绍',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '备注',
  `friend_group_id` int(0) NULL DEFAULT NULL COMMENT '分组归类',
  `status` enum('同意','拒绝','等待','过期') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '等待' COMMENT '状态',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建日期',
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '再发起日期',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of friend_request
-- ----------------------------
INSERT INTO `friend_request` VALUES (15, 10001, 10009, '', 'miyako', 1, '同意', '2024-11-03 13:27:17', '2024-11-03 13:59:46');
INSERT INTO `friend_request` VALUES (16, 10009, 10001, '', '枢都永远', 19, '同意', '2024-11-03 13:43:39', '2024-11-03 13:58:23');
INSERT INTO `friend_request` VALUES (17, 10003, 10017, NULL, '2222', 24, '同意', '2024-11-12 09:51:18', '2024-11-12 10:10:05');
INSERT INTO `friend_request` VALUES (18, 10001, 10005, '', '圣娅', 25, '同意', '2024-11-12 10:55:05', '2024-11-12 10:56:16');

-- ----------------------------
-- Table structure for group_announce
-- ----------------------------
DROP TABLE IF EXISTS `group_announce`;
CREATE TABLE `group_announce`  (
  `id` int(0) NOT NULL,
  `group_id` int(0) NULL DEFAULT NULL COMMENT '群聊id',
  `announce` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '公告信息',
  `created_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '发布时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of group_announce
-- ----------------------------

-- ----------------------------
-- Table structure for group_chat
-- ----------------------------
DROP TABLE IF EXISTS `group_chat`;
CREATE TABLE `group_chat`  (
  `group_id` int(0) NOT NULL AUTO_INCREMENT COMMENT '群聊id',
  `group_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '未命名' COMMENT '群聊名',
  `creator_id` int(0) NOT NULL COMMENT '创建者',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT 'avatar_default.jpg' COMMENT '群聊头像',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '群介绍',
  `space_background` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'default.webp' COMMENT '资料背景',
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '群标签',
  `member_max` int(0) NULL DEFAULT 500 COMMENT '最大成员数',
  `member_total` int(0) NULL DEFAULT 0 COMMENT '当前成员数',
  `auth` enum('confirm','query','allow') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'confirm' COMMENT '验证(confirm确认,query问题+确认,no无需验证)',
  `auth_query` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '验证问题(如果auth是query)',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建日期',
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '修改日期',
  `room_id` int(0) NULL DEFAULT NULL COMMENT '房间号',
  `status` enum('正常','封禁') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '正常' COMMENT '状态',
  `all_ban_talk` int(0) NULL DEFAULT 0 COMMENT '全员禁言',
  PRIMARY KEY (`group_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10030 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of group_chat
-- ----------------------------
INSERT INTO `group_chat` VALUES (10001, '歌赫娜', 1, 'gehenna.png', '欢迎你加入群聊欢迎你加入群聊欢迎你加入群聊欢迎你加入群聊欢迎你加入群聊欢迎你加入群聊', 'ruins.jpg', '风纪委员会,学园,维护秩序', 500, -3, 'confirm', NULL, '2024-04-12 17:01:28', '2024-11-12 10:29:26', 7, NULL, NULL);
INSERT INTO `group_chat` VALUES (10002, '三一', 2, 'trinity.avif', '圣三一学园', 'user_background.png', '学园,教会', 500, -3, 'confirm', NULL, '2024-04-16 23:11:04', '2024-11-12 10:29:26', 8, NULL, NULL);
INSERT INTO `group_chat` VALUES (10003, '联邦理事会', 2, '1731352332645-5231729.png', '欢迎你加入群聊欢迎你加入群聊欢迎你加入群聊欢你聊', '1731352379338-48465400.png', '自治权力机构,awdawdwad', 500, 0, 'query', '你从哪里得知adwa', '2024-04-30 11:08:35', '2024-11-12 10:29:26', 9, NULL, 0);
INSERT INTO `group_chat` VALUES (10025, '画画群', 1, '1729788636069-36401646.jpg', '欢迎各位加入', '1729788639532-985171571.jpg', '画画,练习', 500, -3, 'confirm', NULL, '2024-10-25 00:51:14', '2024-11-12 10:29:26', 46, NULL, 0);
INSERT INTO `group_chat` VALUES (10026, 'dawd', 1, '1729813123756-491676266.jpg', 'afwawf', '1729813138340-240757348.jpg', 'awd,caw,aw', 500, -3, 'confirm', NULL, '2024-10-25 07:38:59', '2024-11-12 10:29:26', 47, NULL, 0);
INSERT INTO `group_chat` VALUES (10027, 'asd', 1, '1729813281442-505179509.jpg', 'adwda', '1729813290169-997717785.jpg', 'faw', 500, -3, 'confirm', NULL, '2024-10-25 07:41:31', '2024-11-12 10:29:26', 48, NULL, 0);
INSERT INTO `group_chat` VALUES (10029, '未命名', 10001, 'avatar_default.jpg', '无简介', 'default.avif', NULL, 500, -3, 'confirm', '', '2024-11-10 12:23:36', '2024-11-12 10:29:26', 58, '正常', 0);

-- ----------------------------
-- Table structure for group_file
-- ----------------------------
DROP TABLE IF EXISTS `group_file`;
CREATE TABLE `group_file`  (
  `file_id` int(0) NOT NULL AUTO_INCREMENT,
  `group_id` int(0) NULL DEFAULT NULL COMMENT '对应的群聊',
  `file_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '文件名',
  `file_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '文件类型',
  `file_size` int(0) NULL DEFAULT NULL COMMENT '文件大小',
  `upload_id` int(0) NULL DEFAULT NULL COMMENT '上传用户id',
  `download_total` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '下载总数',
  `created_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '上传时间',
  PRIMARY KEY (`file_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of group_file
-- ----------------------------

-- ----------------------------
-- Table structure for group_level
-- ----------------------------
DROP TABLE IF EXISTS `group_level`;
CREATE TABLE `group_level`  (
  `group_id` int(0) NOT NULL,
  `level` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '级别',
  `level_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '等级称号'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of group_level
-- ----------------------------
INSERT INTO `group_level` VALUES (10029, '1', '菜鸟');
INSERT INTO `group_level` VALUES (10029, '2', '新手');
INSERT INTO `group_level` VALUES (10029, '3', '学徒');
INSERT INTO `group_level` VALUES (10029, '4', '熟练');
INSERT INTO `group_level` VALUES (10029, '5', '老手');
INSERT INTO `group_level` VALUES (10029, '6', '大师');
INSERT INTO `group_level` VALUES (10029, '7', '宗师');
INSERT INTO `group_level` VALUES (10003, '1', '菜鸟(萌新)');
INSERT INTO `group_level` VALUES (10003, '2', '新手');
INSERT INTO `group_level` VALUES (10003, '3', '学徒');
INSERT INTO `group_level` VALUES (10003, '4', '熟练');
INSERT INTO `group_level` VALUES (10003, '5', '老手');
INSERT INTO `group_level` VALUES (10003, '6', '大师');
INSERT INTO `group_level` VALUES (10003, '7', '宗师');

-- ----------------------------
-- Table structure for group_members
-- ----------------------------
DROP TABLE IF EXISTS `group_members`;
CREATE TABLE `group_members`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `group_id` int(0) NOT NULL COMMENT '群聊id',
  `user_id` int(0) NOT NULL COMMENT '用户id',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT NULL COMMENT '群昵称',
  `position` enum('群主','管理员','成员') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NULL DEFAULT '成员' COMMENT '群职位',
  `unread_msg_count` int(0) NULL DEFAULT 0 COMMENT '群聊未读信息数量',
  `top_up` tinyint(0) NULL DEFAULT 0 COMMENT '置顶',
  `no_disturb` tinyint(0) NULL DEFAULT 0 COMMENT '免打扰',
  `ban_talk` tinyint(0) NULL DEFAULT 0 COMMENT '用户禁言',
  `ignored` tinyint(0) NULL DEFAULT 0 COMMENT '忽略',
  `message_total` int(0) NULL DEFAULT 0 COMMENT '用户个人发送的信息数量',
  `exp` int(0) NULL DEFAULT 0 COMMENT '群经验 用于提升等级',
  `level` int(0) NULL DEFAULT 1 COMMENT '群等级 最大7级',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `last_send_at` timestamp(0) NULL DEFAULT NULL COMMENT '最后发言时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 72 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of group_members
-- ----------------------------
INSERT INTO `group_members` VALUES (1, 10001, 10001, NULL, '群主', 0, 0, 0, 0, 0, 67, 0, 1, '2024-11-10 12:35:31', NULL);
INSERT INTO `group_members` VALUES (2, 10001, 10002, NULL, '管理员', 0, 0, 0, 0, 0, 0, 0, 1, '2024-11-07 22:26:47', NULL);
INSERT INTO `group_members` VALUES (3, 10001, 10009, NULL, '管理员', 0, 0, 0, 0, 0, 0, 0, 1, '2024-11-07 22:26:55', NULL);
INSERT INTO `group_members` VALUES (14, 10029, 10001, NULL, '群主', 0, 1, 1, 0, 1, 67, 0, 1, '2024-11-10 12:23:36', NULL);
INSERT INTO `group_members` VALUES (45, 10029, 10003, NULL, '成员', 0, 0, 0, 0, 0, 7, 0, 1, '2024-11-11 11:44:21', NULL);
INSERT INTO `group_members` VALUES (46, 10003, 10003, NULL, '群主', 0, 1, 1, 0, 0, 7, 16, 1, '2024-11-11 11:44:21', '2024-11-12 10:11:55');
INSERT INTO `group_members` VALUES (67, 10003, 10008, NULL, '管理员', 0, 0, 0, 0, 0, 1, 0, 1, '2024-11-12 03:39:55', NULL);
INSERT INTO `group_members` VALUES (68, 10003, 10001, NULL, '管理员', 0, 0, 0, 0, 0, 15, 52, 2, '2024-11-12 03:39:55', '2024-11-12 05:55:22');

-- ----------------------------
-- Table structure for group_phone_image
-- ----------------------------
DROP TABLE IF EXISTS `group_phone_image`;
CREATE TABLE `group_phone_image`  (
  `image_id` int(0) NOT NULL,
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图像名',
  `favor` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '喜欢数量',
  `photo_id` int(0) NULL DEFAULT NULL COMMENT '相册id',
  `upload_id` int(0) NULL DEFAULT NULL COMMENT '上传用户id',
  `upload_at` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '上传时间',
  PRIMARY KEY (`image_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of group_phone_image
-- ----------------------------

-- ----------------------------
-- Table structure for group_photo
-- ----------------------------
DROP TABLE IF EXISTS `group_photo`;
CREATE TABLE `group_photo`  (
  `photo_id` int(0) NOT NULL AUTO_INCREMENT COMMENT '相册id',
  `group_id` int(0) NULL DEFAULT NULL COMMENT '群聊id',
  `photo_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '相册名',
  `photo_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '相册介绍',
  `photo_size` int(0) NULL DEFAULT 0 COMMENT '相册图片数量',
  `creator_id` int(0) NULL DEFAULT 0 COMMENT '创建者用户id',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  PRIMARY KEY (`photo_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of group_photo
-- ----------------------------

-- ----------------------------
-- Table structure for group_request
-- ----------------------------
DROP TABLE IF EXISTS `group_request`;
CREATE TABLE `group_request`  (
  `request_id` int(0) NOT NULL AUTO_INCREMENT,
  `receiver_id` int(0) NULL DEFAULT NULL COMMENT '发起人id',
  `group_id` int(0) NULL DEFAULT NULL COMMENT '群聊id',
  `sender_id` int(0) NULL DEFAULT NULL COMMENT '邀请人id',
  `handle_id` int(0) NULL DEFAULT NULL COMMENT '处理人id',
  `introduce` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '介绍。根据type区分为用户还是群聊内用户发送的',
  `type` enum('申请','邀请') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '区分是群聊用户邀请用户加入还是用户加入群聊',
  `status` enum('同意','拒绝','等待','过期') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '等待' COMMENT '状态',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建日期',
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '再发起日期',
  PRIMARY KEY (`request_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 75 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of group_request
-- ----------------------------
INSERT INTO `group_request` VALUES (48, 10004, 10029, 10001, NULL, NULL, '邀请', '等待', '2024-11-10 12:23:36', '2024-11-10 12:23:36');
INSERT INTO `group_request` VALUES (49, 10002, 10029, 10001, NULL, NULL, '邀请', '等待', '2024-11-10 12:23:36', '2024-11-10 12:23:36');
INSERT INTO `group_request` VALUES (50, 10008, 10029, 10001, NULL, NULL, '邀请', '等待', '2024-11-10 12:23:36', '2024-11-10 12:23:36');
INSERT INTO `group_request` VALUES (51, 10009, 10029, 10001, NULL, NULL, '邀请', '等待', '2024-11-10 12:23:36', '2024-11-10 12:23:36');
INSERT INTO `group_request` VALUES (52, 10003, 10029, 10001, NULL, NULL, '邀请', '同意', '2024-11-10 12:23:36', '2024-11-11 11:44:21');
INSERT INTO `group_request` VALUES (53, 10001, 10003, NULL, 10003, '你好，我想加入群聊', '申请', '拒绝', '2024-11-11 14:01:41', '2024-11-11 14:11:45');
INSERT INTO `group_request` VALUES (54, 10001, 10003, NULL, 10003, '你好，我想加入群聊', '申请', '拒绝', '2024-11-11 14:14:07', '2024-11-11 14:14:13');
INSERT INTO `group_request` VALUES (55, 10001, 10003, NULL, 10003, '你好，我想加入群聊', '申请', '同意', '2024-11-11 14:14:18', '2024-11-11 14:14:22');
INSERT INTO `group_request` VALUES (56, 10001, 10003, NULL, 10003, '你好，我想加入群聊', '申请', '同意', '2024-11-11 14:37:41', '2024-11-11 14:37:52');
INSERT INTO `group_request` VALUES (57, 10001, 10003, NULL, 10003, '你好，我想加入群聊', '申请', '同意', '2024-11-11 14:40:47', '2024-11-11 14:40:51');
INSERT INTO `group_request` VALUES (58, 10001, 10003, NULL, 10003, '你好，我想加入群聊', '申请', '同意', '2024-11-11 14:50:54', '2024-11-11 14:51:16');
INSERT INTO `group_request` VALUES (59, 10001, 10003, NULL, 10003, '你好，我想加入群聊', '申请', '同意', '2024-11-11 15:01:21', '2024-11-11 15:01:26');
INSERT INTO `group_request` VALUES (60, 10001, 10003, NULL, 10003, '你好，我想加入群聊', '申请', '同意', '2024-11-11 15:03:27', '2024-11-11 15:03:31');
INSERT INTO `group_request` VALUES (61, 10001, 10003, NULL, 10003, '你好，我想加入群聊', '申请', '同意', '2024-11-11 15:03:53', '2024-11-11 15:04:04');
INSERT INTO `group_request` VALUES (62, 10001, 10003, NULL, 10003, '你好，我想加入群聊', '申请', '同意', '2024-11-11 15:06:21', '2024-11-11 15:06:25');
INSERT INTO `group_request` VALUES (63, 10001, 10003, NULL, 10003, '你好，我想加入群聊', '申请', '同意', '2024-11-11 15:08:15', '2024-11-11 15:08:18');
INSERT INTO `group_request` VALUES (64, 10001, 10003, NULL, 10003, '你好，我想加入群聊', '申请', '同意', '2024-11-11 15:12:08', '2024-11-11 15:12:13');
INSERT INTO `group_request` VALUES (65, 10001, 10003, NULL, 10003, '你好，我想加入群聊', '申请', '同意', '2024-11-11 15:13:46', '2024-11-11 15:13:50');
INSERT INTO `group_request` VALUES (66, 10009, 10003, 10001, NULL, '请你加入该群聊', '邀请', '等待', '2024-11-12 00:28:26', '2024-11-12 00:28:26');
INSERT INTO `group_request` VALUES (67, 10002, 10003, 10001, NULL, '请你加入该群聊', '邀请', '等待', '2024-11-12 00:28:26', '2024-11-12 00:28:26');
INSERT INTO `group_request` VALUES (68, 10008, 10003, 10001, NULL, '请你加入该群聊', '邀请', '同意', '2024-11-12 00:28:26', '2024-11-12 02:06:54');
INSERT INTO `group_request` VALUES (69, 10004, 10003, 10001, NULL, '请你加入该群聊', '邀请', '等待', '2024-11-12 00:28:26', '2024-11-12 00:28:26');
INSERT INTO `group_request` VALUES (70, 10006, 10003, 10003, NULL, '请你加入该群聊', '邀请', '等待', '2024-11-12 01:45:10', '2024-11-12 01:45:10');
INSERT INTO `group_request` VALUES (71, 10008, 10003, NULL, 10001, '你好，我想加入群聊', '申请', '同意', '2024-11-12 03:39:44', '2024-11-12 03:39:55');
INSERT INTO `group_request` VALUES (72, 10014, 10003, NULL, 10001, '你好，我想加入群12312聊', '申请', '同意', '2024-11-12 07:56:06', '2024-11-12 07:56:14');
INSERT INTO `group_request` VALUES (73, 10016, 10003, NULL, NULL, '你好，我想加入群聊', '申请', '等待', '2024-11-12 09:40:20', '2024-11-12 09:40:20');
INSERT INTO `group_request` VALUES (74, 10017, 10003, NULL, 10001, '你好，我想加入群聊', '申请', '同意', '2024-11-12 10:27:37', '2024-11-12 10:27:43');

-- ----------------------------
-- Table structure for group_statistics
-- ----------------------------
DROP TABLE IF EXISTS `group_statistics`;
CREATE TABLE `group_statistics`  (
  `group_id` int(0) NOT NULL AUTO_INCREMENT,
  `storage_size` int(0) NULL DEFAULT NULL COMMENT '群聊可供上传的文件存储容量',
  `current_size` int(0) NULL DEFAULT NULL COMMENT '目前占用空间容量',
  `file_length` int(0) NULL DEFAULT 0 COMMENT '文件个数',
  PRIMARY KEY (`group_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of group_statistics
-- ----------------------------

-- ----------------------------
-- Table structure for message
-- ----------------------------
DROP TABLE IF EXISTS `message`;
CREATE TABLE `message`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `sender_id` int(0) NULL DEFAULT NULL COMMENT '发送用户id',
  `receiver_id` int(0) NULL DEFAULT NULL COMMENT '接收用户或群聊id',
  `room_id` int(0) NULL DEFAULT NULL COMMENT '该条信息归属的聊天室id',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '发送内容',
  `type` enum('私人','群聊') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '区分发送在用户还是群聊中',
  `media_type` enum('文本','媒体','文件','表情','警告','通知') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT '媒体类型',
  `file_size` int(0) NULL DEFAULT 0 COMMENT '文件大小',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '发送时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 570 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of message
-- ----------------------------
INSERT INTO `message` VALUES (364, 10001, 10003, 3, '12321', '私人', '文本', 0, '2024-11-10 21:00:49');
INSERT INTO `message` VALUES (365, 10001, 10003, 3, 'daw', '私人', '文本', 0, '2024-11-10 21:00:50');
INSERT INTO `message` VALUES (366, 10001, 10003, 3, 'default/Clanchat_Emoji_24_Tw.png', '私人', '表情', 0, '2024-11-10 21:00:52');
INSERT INTO `message` VALUES (367, 10001, 10003, 3, 'ad', '私人', '文本', 0, '2024-11-10 21:01:44');
INSERT INTO `message` VALUES (368, 10001, 10003, 3, 'adwadaw', '私人', '文本', 0, '2024-11-10 21:03:09');
INSERT INTO `message` VALUES (369, 10001, 10003, 3, 'awdawd', '私人', '文本', 0, '2024-11-10 21:03:10');
INSERT INTO `message` VALUES (370, 10001, 10003, 3, '12312', '私人', '文本', 0, '2024-11-10 21:03:32');
INSERT INTO `message` VALUES (371, 10001, 10003, 3, 'avw', '私人', '文本', 0, '2024-11-10 21:03:33');
INSERT INTO `message` VALUES (372, 10001, 10003, 3, 'awewa', '私人', '文本', 0, '2024-11-10 21:03:34');
INSERT INTO `message` VALUES (373, 10001, 10003, 3, '12312', '私人', '文本', 0, '2024-11-10 21:03:35');
INSERT INTO `message` VALUES (374, 10001, 10003, 3, 'awd', '私人', '文本', 0, '2024-11-10 21:16:41');
INSERT INTO `message` VALUES (375, 10001, 10003, 3, 'default/Clanchat_Emoji_16_Tw.png', '私人', '表情', 0, '2024-11-10 21:16:44');
INSERT INTO `message` VALUES (376, 10001, 10003, 3, 'awdaw', '私人', '文本', 0, '2024-11-10 21:16:46');
INSERT INTO `message` VALUES (377, 10001, 10003, 3, 'awdaw', '私人', '文本', 0, '2024-11-10 21:18:27');
INSERT INTO `message` VALUES (378, 10001, 10003, 3, 'default/Clanchat_Emoji_24_Tw.png', '私人', '表情', 0, '2024-11-10 21:18:29');
INSERT INTO `message` VALUES (379, 10001, 10003, 3, '12312', '私人', '文本', 0, '2024-11-10 21:18:30');
INSERT INTO `message` VALUES (380, 10001, 10003, 3, '123', '私人', '文本', 0, '2024-11-10 21:33:18');
INSERT INTO `message` VALUES (381, 10001, 10003, 3, '21312', '私人', '文本', 0, '2024-11-10 21:33:19');
INSERT INTO `message` VALUES (382, 10001, 10003, 3, 'awdwa', '私人', '文本', 0, '2024-11-10 21:33:55');
INSERT INTO `message` VALUES (383, 10001, 10003, 3, 'ava', '私人', '文本', 0, '2024-11-10 21:33:56');
INSERT INTO `message` VALUES (384, 10001, 10003, 3, 'casc', '私人', '文本', 0, '2024-11-10 21:34:07');
INSERT INTO `message` VALUES (385, 10001, 10003, 3, 'av', '私人', '文本', 0, '2024-11-10 21:34:08');
INSERT INTO `message` VALUES (386, 10003, 10001, 3, 'dwadwa', '私人', '文本', 0, '2024-11-10 21:35:10');
INSERT INTO `message` VALUES (387, 10003, 10001, 3, '12321', '私人', '文本', 0, '2024-11-10 21:35:12');
INSERT INTO `message` VALUES (388, 10001, 10003, 3, '12321', '私人', '文本', 0, '2024-11-10 21:41:14');
INSERT INTO `message` VALUES (389, 10001, 10029, 58, '123', '私人', '文本', 0, '2024-11-10 21:48:18');
INSERT INTO `message` VALUES (390, 10003, 10001, 3, '213', '私人', '文本', 0, '2024-11-10 21:49:00');
INSERT INTO `message` VALUES (391, 10001, 10029, 58, 'awdaw', '私人', '文本', 0, '2024-11-10 21:49:43');
INSERT INTO `message` VALUES (392, 10001, 10029, 58, 'awdw', '私人', '文本', 0, '2024-11-10 21:49:45');
INSERT INTO `message` VALUES (393, 10003, 10001, 3, 'dawda', '私人', '文本', 0, '2024-11-10 21:51:02');
INSERT INTO `message` VALUES (394, 10001, 10009, 53, '1731246903441-558637358.mp4', '私人', '媒体', 0, '2024-11-10 21:55:03');
INSERT INTO `message` VALUES (395, 10001, 10009, 53, '1731247671411-144996753.png', '私人', '文件', 21966, '2024-11-10 22:07:51');
INSERT INTO `message` VALUES (396, 10001, 10009, 53, '1731247710243-762662460.png', '私人', '文件', 21966, '2024-11-10 22:08:30');
INSERT INTO `message` VALUES (397, 10001, 10009, 53, '1731247810849-268316387.png', '私人', '文件', 21966, '2024-11-10 22:10:10');
INSERT INTO `message` VALUES (398, 10001, 10009, 53, '1', '私人', '文本', 0, '2024-11-10 22:10:31');
INSERT INTO `message` VALUES (399, 10001, 10009, 53, '1731247835968-660438881.png', '私人', '文件', 21966, '2024-11-10 22:10:35');
INSERT INTO `message` VALUES (400, 10001, 10009, 53, '1731247852750-60633433.png', '私人', '文件', 21966, '2024-11-10 22:10:52');
INSERT INTO `message` VALUES (401, 10001, 10009, 53, '123', '私人', '文本', 0, '2024-11-10 22:11:23');
INSERT INTO `message` VALUES (402, 10001, 10009, 53, '12321', '私人', '文本', 0, '2024-11-10 22:11:31');
INSERT INTO `message` VALUES (403, 10001, 10009, 53, 'awd', '私人', '文本', 0, '2024-11-10 22:11:36');
INSERT INTO `message` VALUES (404, 10001, 10009, 53, '12321', '私人', '文本', 0, '2024-11-10 22:11:39');
INSERT INTO `message` VALUES (405, 10001, 10009, 53, '1731247913729-46718678.png', '私人', '文件', 21966, '2024-11-10 22:11:53');
INSERT INTO `message` VALUES (406, 10001, 10009, 53, '1731248029345-606339309.png', '私人', '文件', 21966, '2024-11-10 22:13:49');
INSERT INTO `message` VALUES (407, 10001, 10009, 53, '1731248087387-652529453.png', '私人', '文件', 208239, '2024-11-10 22:14:47');
INSERT INTO `message` VALUES (408, 10001, 10009, 53, '213', '私人', '文本', 0, '2024-11-10 22:14:49');
INSERT INTO `message` VALUES (409, 10001, 10009, 53, '1731248111986-777078030.png', '私人', '文件', 21966, '2024-11-10 22:15:12');
INSERT INTO `message` VALUES (410, 10001, 10009, 53, '1731248137800-34028102.png', '私人', '文件', 208239, '2024-11-10 22:15:37');
INSERT INTO `message` VALUES (411, 10001, 10009, 53, '123', '私人', '文本', 0, '2024-11-10 22:15:57');
INSERT INTO `message` VALUES (412, 10001, 10009, 53, '1731248165434-225564118.png', '私人', '文件', 208239, '2024-11-10 22:16:05');
INSERT INTO `message` VALUES (413, 10001, 10009, 53, '1731248326966-568558623.txt', '私人', '文件', 109, '2024-11-10 22:18:46');
INSERT INTO `message` VALUES (414, 10001, 10009, 53, '1731248339034-288924350.docx', '私人', '文件', 11979, '2024-11-10 22:18:59');
INSERT INTO `message` VALUES (415, 10001, 10002, 2, '123', '私人', '文本', 0, '2024-11-11 10:19:35');
INSERT INTO `message` VALUES (416, 10001, 10003, 3, '21321', '私人', '文本', 0, '2024-11-11 10:26:15');
INSERT INTO `message` VALUES (417, 10001, 10003, 3, 'cascsacas', '私人', '文本', 0, '2024-11-11 10:26:21');
INSERT INTO `message` VALUES (418, 10001, 10003, 3, 'dawdwa', '私人', '文本', 0, '2024-11-11 10:26:22');
INSERT INTO `message` VALUES (419, 10001, 10003, 3, 'dawd', '私人', '文本', 0, '2024-11-11 10:26:59');
INSERT INTO `message` VALUES (420, 10001, 10003, 3, '2132', '私人', '文本', 0, '2024-11-11 10:27:01');
INSERT INTO `message` VALUES (421, 10001, 10003, 3, 'cascsa', '私人', '文本', 0, '2024-11-11 10:27:02');
INSERT INTO `message` VALUES (422, 10001, 10003, 3, '12312', '私人', '文本', 0, '2024-11-11 10:30:58');
INSERT INTO `message` VALUES (423, 10001, 10003, 3, 'awdwa', '私人', '文本', 0, '2024-11-11 10:31:14');
INSERT INTO `message` VALUES (424, 10003, 10001, 3, 'awdwad', '私人', '文本', 0, '2024-11-11 10:36:38');
INSERT INTO `message` VALUES (425, 10001, 10003, 3, '12312', '私人', '文本', 0, '2024-11-11 10:36:50');
INSERT INTO `message` VALUES (426, 10001, 10003, 3, 'wadawd', '私人', '文本', 0, '2024-11-11 10:37:21');
INSERT INTO `message` VALUES (427, 10003, 10001, 3, '123213', '私人', '文本', 0, '2024-11-11 10:37:27');
INSERT INTO `message` VALUES (428, 10001, 10003, 3, 'default/Clanchat_Emoji_17_Tw.png', '私人', '表情', 0, '2024-11-11 10:40:04');
INSERT INTO `message` VALUES (429, 10001, 10003, 3, 'default/Clanchat_Emoji_09_Tw.png', '私人', '表情', 0, '2024-11-11 10:40:11');
INSERT INTO `message` VALUES (430, 10001, 10003, 3, 'default/Clanchat_Emoji_17_Tw.png', '私人', '表情', 0, '2024-11-11 10:40:19');
INSERT INTO `message` VALUES (431, 10001, 10003, 3, '1731292826610-142201157.zip', '私人', '文件', 24420584, '2024-11-11 10:40:26');
INSERT INTO `message` VALUES (432, 10003, 10001, 3, 'default/Clanchat_Emoji_17_Tw.png', '私人', '表情', 0, '2024-11-11 10:40:53');
INSERT INTO `message` VALUES (433, 10001, 10003, 9, 'dwadawd', '私人', '文本', 0, '2024-11-11 14:19:08');
INSERT INTO `message` VALUES (434, NULL, 10003, 9, '枢都永远退出了群聊', '私人', '通知', NULL, '2024-11-11 14:42:21');
INSERT INTO `message` VALUES (435, NULL, 10003, 9, '枢都永远加入了群聊', '私人', '通知', NULL, '2024-11-11 14:51:16');
INSERT INTO `message` VALUES (436, NULL, 10003, 9, '枢都永远退出了群聊', '私人', '通知', NULL, '2024-11-11 14:51:51');
INSERT INTO `message` VALUES (437, NULL, 10003, 9, '枢都永远加入了群聊', '私人', '通知', NULL, '2024-11-11 15:01:26');
INSERT INTO `message` VALUES (438, NULL, 10003, 9, '枢都永远退出了群聊', '私人', '通知', NULL, '2024-11-11 15:01:37');
INSERT INTO `message` VALUES (439, NULL, 10003, 9, '枢都永远加入了群聊', '私人', '通知', NULL, '2024-11-11 15:03:31');
INSERT INTO `message` VALUES (440, NULL, 10003, 9, '枢都永远退出了群聊', '私人', '通知', NULL, '2024-11-11 15:03:39');
INSERT INTO `message` VALUES (441, NULL, 10003, 9, '枢都永远加入了群聊', '私人', '通知', NULL, '2024-11-11 15:04:04');
INSERT INTO `message` VALUES (442, NULL, 10003, 9, '枢都永远退出了群聊', '私人', '通知', NULL, '2024-11-11 15:04:58');
INSERT INTO `message` VALUES (443, NULL, 10003, 9, '枢都永远加入了群聊', '私人', '通知', NULL, '2024-11-11 15:06:25');
INSERT INTO `message` VALUES (444, NULL, 10003, 9, '枢都永远退出了群聊', '私人', '通知', NULL, '2024-11-11 15:07:08');
INSERT INTO `message` VALUES (445, NULL, 10003, 9, '枢都永远加入了群聊', '私人', '通知', NULL, '2024-11-11 15:08:18');
INSERT INTO `message` VALUES (446, NULL, 10003, 9, '枢都永远退出了群聊', '私人', '通知', NULL, '2024-11-11 15:08:49');
INSERT INTO `message` VALUES (447, NULL, 10003, 9, '枢都永远加入了群聊', '私人', '通知', NULL, '2024-11-11 15:12:13');
INSERT INTO `message` VALUES (448, NULL, 10003, 9, '枢都永远退出了群聊', '私人', '通知', NULL, '2024-11-11 15:12:33');
INSERT INTO `message` VALUES (449, NULL, 10003, 9, '枢都永远加入了群聊', '私人', '通知', NULL, '2024-11-11 15:13:50');
INSERT INTO `message` VALUES (450, 10001, 10003, 3, 'default/Clanchat_Emoji_01_Tw.png', '私人', '表情', 0, '2024-11-11 15:14:07');
INSERT INTO `message` VALUES (451, 10003, 10001, 3, 'default/Clanchat_Emoji_12_Tw.png', '私人', '表情', 0, '2024-11-11 15:14:17');
INSERT INTO `message` VALUES (452, 10001, 10003, 3, '你好阿', '私人', '文本', 0, '2024-11-11 15:14:24');
INSERT INTO `message` VALUES (453, 10001, 10003, 3, '123', '私人', '文本', 0, '2024-11-11 16:29:21');
INSERT INTO `message` VALUES (454, 10001, 10003, 3, '📞发起了视频聊天', '私人', '文本', 0, '2024-11-11 20:25:46');
INSERT INTO `message` VALUES (455, 10001, 10003, 3, 'default/Clanchat_Emoji_04_Tw.png', '私人', '表情', 0, '2024-11-11 20:59:46');
INSERT INTO `message` VALUES (456, 10001, 10003, 3, '📞发起了视频聊天', '私人', '文本', 0, '2024-11-11 21:35:49');
INSERT INTO `message` VALUES (457, 10001, 10003, 3, '📞发起了视频聊天', '私人', '文本', 0, '2024-11-11 21:46:02');
INSERT INTO `message` VALUES (458, 10001, 10003, 3, '📞发起了视频聊天', '私人', '文本', 0, '2024-11-11 21:46:32');
INSERT INTO `message` VALUES (459, 10003, 10001, 3, '📞发起了视频聊天', '私人', '文本', 0, '2024-11-11 21:46:51');
INSERT INTO `message` VALUES (460, 10003, 10001, 3, '📞发起了视频聊天', '私人', '文本', 0, '2024-11-11 21:47:23');
INSERT INTO `message` VALUES (461, NULL, 10003, 9, '伊吕波加入了群聊', '私人', '通知', NULL, '2024-11-12 00:29:13');
INSERT INTO `message` VALUES (462, NULL, 10003, 9, '伊吕波加入了群聊', '私人', '通知', NULL, '2024-11-12 01:32:34');
INSERT INTO `message` VALUES (463, NULL, 10003, 9, '伊吕波加入了群聊', '私人', '通知', NULL, '2024-11-12 01:34:49');
INSERT INTO `message` VALUES (464, NULL, 10003, 9, '伊吕波加入了群聊', '私人', '通知', NULL, '2024-11-12 01:38:05');
INSERT INTO `message` VALUES (465, NULL, 10003, 9, '伊吕波加入了群聊', '私人', '通知', NULL, '2024-11-12 01:43:31');
INSERT INTO `message` VALUES (466, NULL, 10003, 9, '伊吕波加入了群聊', '私人', '通知', NULL, '2024-11-12 01:45:36');
INSERT INTO `message` VALUES (467, NULL, 10003, 9, '伊吕波加入了群聊', '私人', '通知', NULL, '2024-11-12 01:48:21');
INSERT INTO `message` VALUES (468, 10003, 10003, 9, '伊吕波被移出群聊', '私人', '通知', 0, '2024-11-12 01:52:12');
INSERT INTO `message` VALUES (469, NULL, 10003, 9, '伊吕波加入了群聊', '私人', '通知', NULL, '2024-11-12 02:02:42');
INSERT INTO `message` VALUES (470, 10003, 10003, 9, '伊吕波被移出群聊', '私人', '通知', 0, '2024-11-12 02:04:51');
INSERT INTO `message` VALUES (471, NULL, 10003, 9, '伊吕波加入了群聊', '私人', '通知', NULL, '2024-11-12 02:06:54');
INSERT INTO `message` VALUES (472, 10003, 10003, 9, '伊吕波被移出群聊', '私人', '通知', 0, '2024-11-12 02:13:55');
INSERT INTO `message` VALUES (473, 10003, 10003, 9, '群主将枢都永远任命为管理员', '私人', '通知', 0, '2024-11-12 03:37:49');
INSERT INTO `message` VALUES (474, 10003, 10003, 9, '群主取消了枢都永远的管理员身份', '私人', '通知', 0, '2024-11-12 03:37:57');
INSERT INTO `message` VALUES (475, 10003, 10003, 9, '群主将枢都永远任命为管理员', '私人', '通知', 0, '2024-11-12 03:38:01');
INSERT INTO `message` VALUES (476, NULL, 10003, 9, '伊吕波加入了群聊', '私人', '通知', NULL, '2024-11-12 03:39:55');
INSERT INTO `message` VALUES (477, 10003, 10003, 9, '123', '私人', '文本', 0, '2024-11-12 03:40:54');
INSERT INTO `message` VALUES (478, 10001, 10003, 9, 'awdwa', '私人', '文本', 0, '2024-11-12 03:55:53');
INSERT INTO `message` VALUES (479, 10003, 10003, 9, '枢都永远已被禁言', '私人', '通知', 0, '2024-11-12 04:02:09');
INSERT INTO `message` VALUES (480, 10001, 10003, 9, '123123', '私人', '文本', 0, '2024-11-12 04:02:18');
INSERT INTO `message` VALUES (481, 10003, 10003, 9, '枢都永远已取消禁言', '私人', '通知', 0, '2024-11-12 04:04:34');
INSERT INTO `message` VALUES (482, 10001, 10003, 9, 'dawdwa', '私人', '文本', 0, '2024-11-12 04:04:37');
INSERT INTO `message` VALUES (483, 10001, 10003, 9, 'default/Clanchat_Emoji_02_Tw.png', '私人', '表情', 0, '2024-11-12 04:04:41');
INSERT INTO `message` VALUES (484, 10001, 10003, 9, 'NEEDYGIRL/girl01.webp', '私人', '表情', 0, '2024-11-12 04:08:37');
INSERT INTO `message` VALUES (485, 10001, 10003, 3, '21321', '私人', '文本', 0, '2024-11-12 04:09:43');
INSERT INTO `message` VALUES (486, 10001, 10003, 9, 'NEEDYGIRL/girl03.webp', '私人', '表情', 0, '2024-11-12 04:10:42');
INSERT INTO `message` VALUES (487, 10003, 10003, 9, 'dw', '私人', '文本', 0, '2024-11-12 04:10:53');
INSERT INTO `message` VALUES (488, 10008, 10003, 9, 'qe2eq', '私人', '文本', 0, '2024-11-12 04:13:19');
INSERT INTO `message` VALUES (489, 10001, 10003, 9, '123', '私人', '文本', 0, '2024-11-12 04:13:23');
INSERT INTO `message` VALUES (490, 10003, 10003, 9, 'dawdaw', '私人', '文本', 0, '2024-11-12 04:13:26');
INSERT INTO `message` VALUES (491, 10001, 10003, 9, '123', '私人', '文本', 0, '2024-11-12 04:26:02');
INSERT INTO `message` VALUES (492, 10001, 10003, 9, 'casca', '私人', '文本', 0, '2024-11-12 04:38:10');
INSERT INTO `message` VALUES (493, 10001, 10003, 9, 'dawdwa', '私人', '文本', 0, '2024-11-12 04:38:35');
INSERT INTO `message` VALUES (494, 10003, 10003, 9, 'awdwad', '私人', '文本', 0, '2024-11-12 04:38:41');
INSERT INTO `message` VALUES (495, 10001, 10003, 9, 'default/Clanchat_Emoji_15_Tw.png', '私人', '表情', 0, '2024-11-12 04:38:57');
INSERT INTO `message` VALUES (496, 10003, 10003, 9, 'NEEDYGIRL/girl01.avif', '私人', '表情', 0, '2024-11-12 05:21:55');
INSERT INTO `message` VALUES (497, 10001, 10003, 9, 'ascsac', '私人', '文本', 0, '2024-11-12 05:38:26');
INSERT INTO `message` VALUES (498, 10001, 10003, 9, '12312', '私人', '文本', 0, '2024-11-12 05:50:39');
INSERT INTO `message` VALUES (499, 10001, 10003, 9, 'awdwad', '私人', '文本', 0, '2024-11-12 05:54:03');
INSERT INTO `message` VALUES (500, 10001, 10003, 9, '12312312', '私人', '文本', 0, '2024-11-12 05:55:22');
INSERT INTO `message` VALUES (501, 10001, 10003, 9, '123', '私人', '文本', 0, '2024-11-12 05:55:38');
INSERT INTO `message` VALUES (502, 10001, 10008, 10, 'default/Clanchat_Emoji_17_Tw.png', '私人', '表情', 0, '2024-11-12 06:03:15');
INSERT INTO `message` VALUES (503, 10001, 10008, 10, '123123', '私人', '文本', 0, '2024-11-12 06:05:56');
INSERT INTO `message` VALUES (504, 10001, 10008, 10, 'awdawdawd', '私人', '文本', 0, '2024-11-12 06:05:57');
INSERT INTO `message` VALUES (505, 10001, 10003, 9, 'default/Clanchat_Emoji_14_Tw.png', '私人', '表情', 0, '2024-11-12 07:18:25');
INSERT INTO `message` VALUES (506, 10001, 10003, 9, 'default/Clanchat_Emoji_14_Tw.png', '私人', '表情', 0, '2024-11-12 07:18:26');
INSERT INTO `message` VALUES (507, 10001, 10003, 9, 'default/Clanchat_Emoji_02_Tw.png', '私人', '表情', 0, '2024-11-12 07:18:28');
INSERT INTO `message` VALUES (508, 10001, 10003, 9, 'default/Clanchat_Emoji_02_Tw.png', '私人', '表情', 0, '2024-11-12 07:18:28');
INSERT INTO `message` VALUES (509, 10001, 10003, 9, 'default/Clanchat_Emoji_02_Tw.png', '私人', '表情', 0, '2024-11-12 07:18:28');
INSERT INTO `message` VALUES (510, 10001, 10003, 9, 'default/Clanchat_Emoji_01_Tw.png', '私人', '表情', 0, '2024-11-12 07:18:29');
INSERT INTO `message` VALUES (511, 10001, 10003, 9, 'default/Clanchat_Emoji_01_Tw.png', '私人', '表情', 0, '2024-11-12 07:18:30');
INSERT INTO `message` VALUES (512, 10001, 10003, 3, 'default/Clanchat_Emoji_17_Tw.png', '私人', '表情', 0, '2024-11-12 07:19:14');
INSERT INTO `message` VALUES (513, 10001, 10003, 3, 'default/Clanchat_Emoji_17_Tw.png', '私人', '表情', 0, '2024-11-12 07:19:14');
INSERT INTO `message` VALUES (514, 10001, 10003, 3, 'default/Clanchat_Emoji_17_Tw.png', '私人', '表情', 0, '2024-11-12 07:19:14');
INSERT INTO `message` VALUES (515, 10001, 10003, 3, 'default/Clanchat_Emoji_17_Tw.png', '私人', '表情', 0, '2024-11-12 07:19:14');
INSERT INTO `message` VALUES (516, 10001, 10003, 3, 'default/Clanchat_Emoji_17_Tw.png', '私人', '表情', 0, '2024-11-12 07:19:14');
INSERT INTO `message` VALUES (517, 10001, 10003, 3, 'default/Clanchat_Emoji_17_Tw.png', '私人', '表情', 0, '2024-11-12 07:19:15');
INSERT INTO `message` VALUES (518, 10001, 10003, 3, 'default/Clanchat_Emoji_17_Tw.png', '私人', '表情', 0, '2024-11-12 07:19:15');
INSERT INTO `message` VALUES (519, 10001, 10003, 3, 'default/Clanchat_Emoji_17_Tw.png', '私人', '表情', 0, '2024-11-12 07:19:15');
INSERT INTO `message` VALUES (520, 10001, 10003, 3, 'default/Clanchat_Emoji_17_Tw.png', '私人', '表情', 0, '2024-11-12 07:19:15');
INSERT INTO `message` VALUES (521, 10001, 10008, 10, 'default/Clanchat_Emoji_03_Tw.png', '私人', '表情', 0, '2024-11-12 07:19:21');
INSERT INTO `message` VALUES (522, 10001, 10008, 10, 'default/Clanchat_Emoji_03_Tw.png', '私人', '表情', 0, '2024-11-12 07:19:22');
INSERT INTO `message` VALUES (523, 10001, 10008, 10, 'default/Clanchat_Emoji_03_Tw.png', '私人', '表情', 0, '2024-11-12 07:19:22');
INSERT INTO `message` VALUES (524, 10001, 10008, 10, 'default/Clanchat_Emoji_03_Tw.png', '私人', '表情', 0, '2024-11-12 07:19:22');
INSERT INTO `message` VALUES (525, 10001, 10008, 10, 'default/Clanchat_Emoji_03_Tw.png', '私人', '表情', 0, '2024-11-12 07:19:22');
INSERT INTO `message` VALUES (526, 10001, 10008, 10, 'default/Clanchat_Emoji_03_Tw.png', '私人', '表情', 0, '2024-11-12 07:19:22');
INSERT INTO `message` VALUES (527, 10001, 10008, 10, 'NEEDYGIRL/girl03.webp', '私人', '表情', 0, '2024-11-12 07:19:24');
INSERT INTO `message` VALUES (528, 10001, 10008, 10, 'NEEDYGIRL/girl03.webp', '私人', '表情', 0, '2024-11-12 07:19:25');
INSERT INTO `message` VALUES (529, 10001, 10008, 10, 'NEEDYGIRL/girl03.webp', '私人', '表情', 0, '2024-11-12 07:19:25');
INSERT INTO `message` VALUES (530, 10001, 10008, 10, 'NEEDYGIRL/girl03.webp', '私人', '表情', 0, '2024-11-12 07:19:25');
INSERT INTO `message` VALUES (531, 10001, 10008, 10, 'NEEDYGIRL/girl05.webp', '私人', '表情', 0, '2024-11-12 07:19:27');
INSERT INTO `message` VALUES (532, 10001, 10008, 10, 'NEEDYGIRL/girl05.webp', '私人', '表情', 0, '2024-11-12 07:19:27');
INSERT INTO `message` VALUES (533, 10001, 10008, 10, 'NEEDYGIRL/girl05.webp', '私人', '表情', 0, '2024-11-12 07:19:28');
INSERT INTO `message` VALUES (534, 10001, 10008, 10, 'NEEDYGIRL/girl05.webp', '私人', '表情', 0, '2024-11-12 07:19:28');
INSERT INTO `message` VALUES (535, 10001, 10008, 10, 'NEEDYGIRL/girl05.webp', '私人', '表情', 0, '2024-11-12 07:19:28');
INSERT INTO `message` VALUES (536, 10001, 10008, 10, '123213', '私人', '文本', 0, '2024-11-12 07:24:10');
INSERT INTO `message` VALUES (537, 10001, 10008, 10, '12312', '私人', '文本', 0, '2024-11-12 07:24:11');
INSERT INTO `message` VALUES (538, 10001, 10008, 10, '12321', '私人', '文本', 0, '2024-11-12 07:24:27');
INSERT INTO `message` VALUES (539, NULL, 10003, 9, '未命名加入了群聊', '私人', '通知', NULL, '2024-11-12 07:56:14');
INSERT INTO `message` VALUES (540, 10001, 10003, 9, 'default/Clanchat_Emoji_01_Tw.png', '私人', '表情', 0, '2024-11-12 07:56:30');
INSERT INTO `message` VALUES (541, 10014, 10003, 9, '123', '私人', '文本', 0, '2024-11-12 07:56:41');
INSERT INTO `message` VALUES (542, 10001, 10003, 3, 'default/Clanchat_Emoji_01_Tw.png', '私人', '表情', 0, '2024-11-12 09:31:39');
INSERT INTO `message` VALUES (543, 10001, 10003, 3, '📞发起了视频聊天', '私人', '文本', 0, '2024-11-12 09:31:55');
INSERT INTO `message` VALUES (544, 10001, 10003, 3, 'awdawd', '私人', '文本', 0, '2024-11-12 09:39:09');
INSERT INTO `message` VALUES (545, NULL, 10003, 9, '未命名加入了群聊', '私人', '通知', NULL, '2024-11-12 09:41:30');
INSERT INTO `message` VALUES (546, 10017, 10003, 9, 'awdaw', '私人', '文本', 0, '2024-11-12 09:42:33');
INSERT INTO `message` VALUES (547, 10017, 10003, 9, '12', '私人', '文本', 0, '2024-11-12 09:49:15');
INSERT INTO `message` VALUES (548, 10003, 10017, 64, 'awdawd', '私人', '文本', 0, '2024-11-12 10:11:14');
INSERT INTO `message` VALUES (549, 10003, 10017, 64, 'NEEDYGIRL/girl03.webp', '私人', '表情', 0, '2024-11-12 10:11:24');
INSERT INTO `message` VALUES (550, 10003, 10017, 64, 'NEEDYGIRL/girl05.webp', '私人', '表情', 0, '2024-11-12 10:11:41');
INSERT INTO `message` VALUES (551, 10017, 10003, 64, 'default/Clanchat_Emoji_24_Tw.png', '私人', '表情', 0, '2024-11-12 10:11:48');
INSERT INTO `message` VALUES (552, 10003, 10003, 9, 'awdawdawdwa', '私人', '文本', 0, '2024-11-12 10:11:55');
INSERT INTO `message` VALUES (553, 10017, 10003, 9, 'awdawdawdawdaw', '私人', '文本', 0, '2024-11-12 10:12:02');
INSERT INTO `message` VALUES (554, 10017, 10003, 9, 'default/Clanchat_Emoji_02_Tw.png', '私人', '表情', 0, '2024-11-12 10:12:04');
INSERT INTO `message` VALUES (555, 10003, 10003, 9, 'NEEDYGIRL/girl02.avif', '私人', '表情', 0, '2024-11-12 10:12:28');
INSERT INTO `message` VALUES (556, 10017, 10003, 9, '1731377608297-525664931.mp4', '私人', '媒体', 0, '2024-11-12 10:13:28');
INSERT INTO `message` VALUES (557, 10003, 10003, 9, '群主任命伊吕波为管理员', '私人', '通知', 0, '2024-11-12 10:19:27');
INSERT INTO `message` VALUES (558, 10001, 10003, 9, '2222被移出群聊', '私人', '通知', 0, '2024-11-12 10:19:47');
INSERT INTO `message` VALUES (559, 10003, 10003, 9, '未命名被移出群聊', '私人', '通知', 0, '2024-11-12 10:20:42');
INSERT INTO `message` VALUES (560, NULL, 10003, 9, '2222加入了群聊', '私人', '通知', NULL, '2024-11-12 10:27:43');
INSERT INTO `message` VALUES (561, 10001, 10003, 9, '2222被移出群聊', '私人', '通知', 0, '2024-11-12 10:29:26');
INSERT INTO `message` VALUES (562, 10001, 10003, 3, '你好', '私人', '文本', 0, '2024-11-12 10:58:18');
INSERT INTO `message` VALUES (563, 10001, 10003, 3, 'default/Clanchat_Emoji_03_Tw.png', '私人', '表情', 0, '2024-11-12 10:58:34');
INSERT INTO `message` VALUES (564, 10001, 10003, 3, 'default/Clanchat_Emoji_04_Tw.png', '私人', '表情', 0, '2024-11-12 10:58:34');
INSERT INTO `message` VALUES (565, 10001, 10003, 3, 'NEEDYGIRL/girl02.avif', '私人', '表情', 0, '2024-11-12 10:58:38');
INSERT INTO `message` VALUES (566, 10001, 10003, 3, '1731380337810-682795548.mp4', '私人', '媒体', 0, '2024-11-12 10:58:57');
INSERT INTO `message` VALUES (567, 10001, 10003, 3, '📞发起了视频聊天', '私人', '文本', 0, '2024-11-12 10:59:09');
INSERT INTO `message` VALUES (568, 10001, 10003, 9, 'default/Clanchat_Emoji_08_Tw.png', '私人', '表情', 0, '2024-11-12 11:01:09');
INSERT INTO `message` VALUES (569, 10001, 10003, 9, 'awdaw', '私人', '文本', 0, '2024-11-12 11:01:38');
INSERT INTO `message` VALUES (570, 10001, 10003, 9, 'default/Clanchat_Emoji_03_Tw.png', '私人', '表情', 0, '2024-11-12 11:01:53');

-- ----------------------------
-- Table structure for message_statistics
-- ----------------------------
DROP TABLE IF EXISTS `message_statistics`;
CREATE TABLE `message_statistics`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `room_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `total` int(0) NOT NULL DEFAULT 0 COMMENT '消息总数',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '创建时间',
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0) COMMENT '修改时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of message_statistics
-- ----------------------------
INSERT INTO `message_statistics` VALUES (1, '1', 1, '2023-12-26 14:49:37', '2024-05-07 23:16:01');
INSERT INTO `message_statistics` VALUES (2, '2', 15, '2023-12-26 16:18:31', '2024-06-26 17:15:23');
INSERT INTO `message_statistics` VALUES (3, '3', 86, '2023-12-26 16:18:50', '2024-06-21 11:43:01');
INSERT INTO `message_statistics` VALUES (4, '4', 0, '2023-12-26 16:26:50', '2024-05-07 22:42:43');
INSERT INTO `message_statistics` VALUES (5, '5', 45, '2023-12-26 18:19:59', '2024-09-06 19:31:02');
INSERT INTO `message_statistics` VALUES (7, '7', 6, '2024-06-17 08:54:45', '2024-10-23 16:19:44');
INSERT INTO `message_statistics` VALUES (8, '10', 8, '2024-06-19 18:23:13', '2024-06-20 20:46:10');

-- ----------------------------
-- Table structure for room
-- ----------------------------
DROP TABLE IF EXISTS `room`;
CREATE TABLE `room`  (
  `room_id` int(0) NOT NULL AUTO_INCREMENT,
  `type` enum('私人','群聊') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `last_msg` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '该房间最后一条信息',
  `last_msg_at` datetime(0) NULL DEFAULT NULL COMMENT '最后一条信息的发送时间',
  `msg_total` int(0) NULL DEFAULT 0 COMMENT '消息总数',
  PRIMARY KEY (`room_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 65 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of room
-- ----------------------------
INSERT INTO `room` VALUES (1, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (2, '私人', '123', '2024-11-11 10:19:35', 42);
INSERT INTO `room` VALUES (3, '私人', '📞发起了视频聊天', '2024-11-12 10:59:09', 90);
INSERT INTO `room` VALUES (4, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (5, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (6, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (7, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (8, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (9, '群聊', '[表情]', '2024-11-12 11:01:53', 83);
INSERT INTO `room` VALUES (10, '私人', '12321', '2024-11-12 07:24:27', 21);
INSERT INTO `room` VALUES (11, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (12, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (13, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (14, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (15, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (16, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (17, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (18, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (19, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (20, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (21, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (22, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (23, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (24, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (25, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (26, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (27, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (28, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (29, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (30, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (31, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (32, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (33, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (34, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (35, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (36, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (37, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (38, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (39, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (40, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (41, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (42, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (43, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (44, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (45, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (46, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (47, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (48, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (49, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (50, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (51, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (52, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (53, '私人', '[文件]', '2024-11-10 22:18:59', 40);
INSERT INTO `room` VALUES (54, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (55, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (56, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (57, '群聊', NULL, NULL, 0);
INSERT INTO `room` VALUES (58, '群聊', 'awdw', '2024-11-10 21:49:45', 30);
INSERT INTO `room` VALUES (59, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (60, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (61, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (62, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (63, '私人', NULL, NULL, 0);
INSERT INTO `room` VALUES (64, '私人', '[表情]', '2024-11-12 10:11:48', 4);
INSERT INTO `room` VALUES (65, '私人', NULL, NULL, 0);

-- ----------------------------
-- Table structure for stickers
-- ----------------------------
DROP TABLE IF EXISTS `stickers`;
CREATE TABLE `stickers`  (
  `sticker_id` int(0) NOT NULL AUTO_INCREMENT COMMENT '贴纸id',
  `title` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '贴纸名',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '贴纸介绍',
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '贴纸图片',
  `background_color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '背景颜色',
  `text_color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '文本颜色',
  `rarity` enum('普通','稀有','史诗','传说') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '贴纸品级',
  `get_method` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '获取方式',
  PRIMARY KEY (`sticker_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of stickers
-- ----------------------------
INSERT INTO `stickers` VALUES (1, '蓝色海洋', '所有用户的始发点，象征着所有用户的共同起点，如同海洋般广阔无垠的交流空间。代表着沟通的无限可能，并在聊天中探索未知', NULL, 'var(--blue)', 'white', '普通', '用户默认贴纸');
INSERT INTO `stickers` VALUES (2, '蜗牛大家族', '一种至高的美学，就是SummerTime。该词已经发展成为一个完整的体系，你能在其中体会到甜蜜、孤独、燥热、阳光、河流、流动的树影......', 'stickers1.jpg', '#797979', 'white', '稀有', '限时赠送');
INSERT INTO `stickers` VALUES (3, 'Ouroboros', '“Ouroboros”这个称谓，原自古希腊，在很多远古神话中，都流传着一条吞食自身而存活下去的蛇，实则比喻人从诞生之日起，不断蚕食着昨日的自己，死后转生，重新由婴儿开始重复新的一生。 咬住自己的尾巴而首尾相连的蛇，就是生命轮回往复的象征。', 'stickers2.jpg', '#eee', 'rgb(106 8 165)', '史诗', '无法获取');
INSERT INTO `stickers` VALUES (4, '琥珀之爱', '随心所欲的活着', 'stickers3.jpg', '#815', 'white', '稀有', '无法获取');
INSERT INTO `stickers` VALUES (5, '超越天空', '抬起头来。仰望天空。答案就在那边', 'stickers4.jpg', 'white', 'white', '传说', '无法获取');
INSERT INTO `stickers` VALUES (6, 'Ahead of Us', '因为，大家不都是这样吗？有着想要抓住的事物', 'stickers5.jpg', 'rgb(113 113 113)', 'white', '史诗', '无法获取');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `user_id` int(0) NOT NULL AUTO_INCREMENT COMMENT '用户id',
  `account` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '账号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '密码',
  `username` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '未命名' COMMENT '用户名',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'avatar_default.jpg' COMMENT '头像',
  `phone` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '手机号',
  `gender` enum('保密','男','女') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '保密' COMMENT '性别',
  `age` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '保密' COMMENT '年龄',
  `introduce` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '自我介绍',
  `born_at` date NULL DEFAULT NULL COMMENT '出生日期',
  `space_background` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'default.webp' COMMENT '个人空间背景',
  `space_auth` enum('allow','onlyFriend','noPass','onlyRequest') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT 'allow' COMMENT '个人空间权限全局设置 allow:放行 onlyFriend:仅限好友 onlyRequest:只有自己同意的人能访问 noPass:禁止访问',
  `showFriend` tinyint(0) NULL DEFAULT 1 COMMENT '是否对其他用户展示自己的相关好友',
  `used_stickers` int(0) NULL DEFAULT NULL COMMENT '正在使用的贴纸',
  `online_status` enum('上线','离线') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '上线状态',
  `created_at` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '账号创建时间',
  `last_login` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '最后登录时间',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10018 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (10001, 'root', 'admin', '枢都永远', '1731380250906-756969972.webp', '12324124124', '男', '保密', '喜欢各种类型的动漫和游戏欢各种类型的动漫和游戏', '2024-08-30', '1731364296978-74835720.jpg', 'allow', NULL, NULL, '离线', '2024-09-12 09:58:02', '2024-09-12 09:58:02');
INSERT INTO `user` VALUES (10002, 'arona', 'seito', '阿罗娜', 'arona.png', '21312312312', '保密', '保密', '欧帕兹“什亭之箱”的主要操作系统A.R.O.N.A。\r\n作为高性能AI，是“什亭之箱”的系统管理者和主要OS。', '2016-06-01', '1729787938161-532539967.jpg', 'allow', NULL, NULL, '上线', '2024-04-09 14:33:19', '2024-10-09 22:37:53');
INSERT INTO `user` VALUES (10003, 'pulana', 'seito', '普拉娜', 'pulana.png', 'dawdawdwadwad', '保密', '保密', '另一位阿罗娜。', '2022-01-19', 'custom1.png', 'allow', NULL, NULL, '上线', '2024-04-12 15:08:10', '2024-06-19 00:52:26');
INSERT INTO `user` VALUES (10004, 'kaityou', 'seito', '学生会长', 'kaityou.png', 'dawdawdwadwad', '女', '保密', '掌管整个基沃托斯联邦学生会的学生会长', '2022-02-19', 'init.png', 'allow', NULL, NULL, '上线', '2024-04-12 15:06:46', '2024-05-07 13:10:47');
INSERT INTO `user` VALUES (10005, 'seia', 'seito', '圣娅', 'seia.png', NULL, '女', '保密', '圣三一学生会茶会的成员。三位学生会长的其中之一', '2022-03-19', 'ruins.jpg', 'allow', NULL, NULL, '离线', '2024-04-16 20:39:33', '2024-04-16 20:39:33');
INSERT INTO `user` VALUES (10006, 'shiroko', 'seito', '白子', 'shiroko.png', NULL, '保密', '16', '自行车伙伴招募中……', '2022-05-16', '1729788102887-507462709.jpg', 'allow', NULL, NULL, '上线', '2024-04-16 20:42:01', '2024-06-17 08:53:12');
INSERT INTO `user` VALUES (10007, 'hina', 'seito', '日奈', 'hina.png', NULL, '女', '17', '格黑娜学园的风纪委员长。平常是觉得什么都很麻烦的懒虫少女，但是一旦在和校规有关的问题上，就会展现出严格的风纪委员长的样子。经常把“好麻烦”作为口头禅，但在战场上从不迷茫，快速判断并行动。因此与格黑娜敌对的组织最害怕她出场战斗。', '2022-02-19', 'light.jpg', 'allow', NULL, NULL, NULL, '2024-04-16 20:43:21', '2024-04-16 20:43:21');
INSERT INTO `user` VALUES (10008, 'iroha', 'seito', '伊吕波', 'iroha.png', NULL, '女', '16', '	\r\n所属于格黑娜学园「万魔殿」的议员之一。\r\n虽然很怕麻烦，不仅是所属的格黑娜环境，还有学生会长真琴同学经常引发问题，她还是每天一边抱怨叹气一边淡然地处理着无限产生的工作的样子…', '2022-11-16', 'majo1_update.png', 'allow', NULL, NULL, '上线', '2024-04-16 20:45:17', '2024-06-20 20:45:00');
INSERT INTO `user` VALUES (10009, 'miyako', 'seito', 'miyako', 'miyako.png', '', '女', '保密', '隶属于SRT特殊学院，RABBIT小队的小队长。 憧憬着前辈们，进入了SRT特殊学院，但是学校突然关闭了。目前与同一个小队的成员住在公园里。因为自己总是没什么表情，情绪也很少表达，往往被认为是个冷漠、不友好的人。然而，她心中总是为成员们担心，是有一颗善良的心的人。呼号是“RABBIT1”。', '2022-01-07', '1729788254450-309770244.jpg', 'allow', NULL, NULL, '上线', '2024-04-16 20:46:33', '2024-06-20 19:07:56');
INSERT INTO `user` VALUES (10012, 'test', '123', '未命名', 'avatar_default.jpg', NULL, '保密', '保密', NULL, NULL, 'default.webp', 'allow', 1, NULL, NULL, '2024-11-10 23:21:06', '2024-11-10 23:21:06');
INSERT INTO `user` VALUES (10013, 'admin1', 'admin', '未命名', 'avatar_default.jpg', NULL, '保密', '保密', NULL, NULL, 'default.webp', 'allow', 1, NULL, NULL, '2024-11-12 07:09:46', '2024-11-12 07:09:46');
INSERT INTO `user` VALUES (10014, 'abcd', 'abcd', '未命名', 'avatar_default.jpg', NULL, '保密', '保密', NULL, NULL, 'default.webp', 'allow', 1, NULL, NULL, '2024-11-12 07:10:42', '2024-11-12 07:10:42');
INSERT INTO `user` VALUES (10015, 'kppo', '123', '未命名', '1731370590475-481418077.png', NULL, '保密', '保密', NULL, NULL, 'default.webp', 'allow', 1, NULL, NULL, '2024-11-12 08:00:27', '2024-11-12 08:00:27');
INSERT INTO `user` VALUES (10016, 'demo123', '1234', '未命名', 'avatar_default.jpg', NULL, '保密', '保密', NULL, NULL, 'default.webp', 'allow', 1, NULL, NULL, '2024-11-12 09:40:07', '2024-11-12 09:40:07');
INSERT INTO `user` VALUES (10017, 'demo1234', '123', '2222', '1731375809309-718698848.webp', NULL, '保密', '保密', NULL, '1970-01-01', '1731376238570-726769566.jpg', 'onlyFriend', 1, NULL, NULL, '2024-11-12 09:41:19', '2024-11-12 09:41:19');

-- ----------------------------
-- Table structure for user_area
-- ----------------------------
DROP TABLE IF EXISTS `user_area`;
CREATE TABLE `user_area`  (
  `user_id` int(0) NULL DEFAULT NULL
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_area
-- ----------------------------
INSERT INTO `user_area` VALUES (1);
INSERT INTO `user_area` VALUES (2);

-- ----------------------------
-- Table structure for user_ban
-- ----------------------------
DROP TABLE IF EXISTS `user_ban`;
CREATE TABLE `user_ban`  (
  `user_id` int(0) NOT NULL COMMENT '黑名单的从属者',
  `ban_user_id` int(0) NULL DEFAULT NULL COMMENT '黑名单上的用户id',
  `created_id` datetime(0) NULL DEFAULT NULL COMMENT '加入黑名单的时间'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_ban
-- ----------------------------

-- ----------------------------
-- Table structure for user_emoji_subscribe
-- ----------------------------
DROP TABLE IF EXISTS `user_emoji_subscribe`;
CREATE TABLE `user_emoji_subscribe`  (
  `user_id` int(0) NOT NULL,
  `emoji_id` int(0) NULL DEFAULT NULL,
  `subscribe_at` datetime(0) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_emoji_subscribe
-- ----------------------------

-- ----------------------------
-- Table structure for user_mail
-- ----------------------------
DROP TABLE IF EXISTS `user_mail`;
CREATE TABLE `user_mail`  (
  `mail_id` int(0) NOT NULL AUTO_INCREMENT,
  `user_id` int(0) NULL DEFAULT NULL COMMENT '邮件的接收用户',
  `mail_content` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '邮件信息',
  `mail_item` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '赠送贴纸',
  `status` enum('生效','失效','过期') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '生效' COMMENT '状态',
  `expire_at` datetime(0) NULL DEFAULT NULL COMMENT '过期时间',
  `created_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '发送时间',
  PRIMARY KEY (`mail_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_mail
-- ----------------------------
INSERT INTO `user_mail` VALUES (1, 10012, '欢迎你,新用户,我给你准备了一份礼物', '2', '失效', '2024-12-11 23:45:27', '2024-11-10 23:21:06');
INSERT INTO `user_mail` VALUES (2, 10013, '欢迎你,新用户,我给你准备了一份礼物', '2', '生效', '2024-12-12 07:09:46', '2024-11-12 07:09:46');
INSERT INTO `user_mail` VALUES (3, 10014, '欢迎你,新用户,我给你准备了一份礼物', '2', '失效', '2024-12-12 07:10:42', '2024-11-12 07:10:42');
INSERT INTO `user_mail` VALUES (4, 10015, '欢迎你,新用户,我给你准备了一份礼物', '2', '生效', '2024-12-12 08:00:27', '2024-11-12 08:00:27');
INSERT INTO `user_mail` VALUES (5, 10016, '欢迎你,新用户,我给你准备了一份礼物', '2', '生效', '2024-12-12 09:40:07', '2024-11-12 09:40:07');
INSERT INTO `user_mail` VALUES (6, 10017, '欢迎你,新用户,我给你准备了一份礼物', '2', '失效', '2024-12-12 09:41:19', '2024-11-12 09:41:19');

-- ----------------------------
-- Table structure for user_moments
-- ----------------------------
DROP TABLE IF EXISTS `user_moments`;
CREATE TABLE `user_moments`  (
  `moments_id` int(0) NOT NULL AUTO_INCREMENT,
  `user_id` int(0) NULL DEFAULT NULL COMMENT '动态回复',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '动态内容',
  `thumb_up_count` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '点赞数',
  `reply_count` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '回复数',
  `created_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '动态发布时间',
  PRIMARY KEY (`moments_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 32 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_moments
-- ----------------------------
INSERT INTO `user_moments` VALUES (16, 10001, 'adwwadaw21321312', '0', '0', '2024-11-06 15:13:55');
INSERT INTO `user_moments` VALUES (24, 10001, 'xzx', '1', '0', '2024-11-06 15:21:20');
INSERT INTO `user_moments` VALUES (26, 10001, '今日分享', '0', '0', '2024-11-06 18:15:25');
INSERT INTO `user_moments` VALUES (29, 10001, 'e21321', '0', '0', '2024-11-06 18:20:10');
INSERT INTO `user_moments` VALUES (30, 10001, 'xasx', '2', '0', '2024-11-06 18:20:57');
INSERT INTO `user_moments` VALUES (31, 10017, 'dwadawdawawda', '2', '0', '2024-11-12 09:50:28');

-- ----------------------------
-- Table structure for user_moments_media
-- ----------------------------
DROP TABLE IF EXISTS `user_moments_media`;
CREATE TABLE `user_moments_media`  (
  `media_id` int(0) NOT NULL AUTO_INCREMENT,
  `moments_id` int(0) NULL DEFAULT NULL,
  `media_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `src` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`media_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_moments_media
-- ----------------------------
INSERT INTO `user_moments_media` VALUES (6, 16, 'video', '1730877233732-126446701.mp4');
INSERT INTO `user_moments_media` VALUES (7, 16, 'image', '1730877229021-348782531.png');
INSERT INTO `user_moments_media` VALUES (8, 26, 'image', '1730888115653-520205112.png');
INSERT INTO `user_moments_media` VALUES (9, 26, 'video', '1730888106687-351798181.mp4');
INSERT INTO `user_moments_media` VALUES (10, 31, 'image', '1731376223248-244503534.jpg');
INSERT INTO `user_moments_media` VALUES (11, 31, 'image', '1731376226143-482579367.jpg');
INSERT INTO `user_moments_media` VALUES (12, 31, 'image', '1731376220848-406208371.jpg');

-- ----------------------------
-- Table structure for user_moments_reply
-- ----------------------------
DROP TABLE IF EXISTS `user_moments_reply`;
CREATE TABLE `user_moments_reply`  (
  `reply_id` int(0) NOT NULL AUTO_INCREMENT,
  `moments_id` int(0) NULL DEFAULT NULL COMMENT '回复的动态',
  `reply_user_id` int(0) NULL DEFAULT NULL COMMENT '回复者',
  `received_user_id` int(0) NULL DEFAULT NULL COMMENT '被回复的回复者(如果有)',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '回复内容',
  `created_at` datetime(0) NULL DEFAULT NULL COMMENT '回复时间',
  PRIMARY KEY (`reply_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_moments_reply
-- ----------------------------
INSERT INTO `user_moments_reply` VALUES (14, 25, 10001, NULL, 'cascawdawd', '2024-11-06 17:27:43');
INSERT INTO `user_moments_reply` VALUES (15, 25, 10001, 10001, '12312rawr', '2024-11-06 17:27:51');
INSERT INTO `user_moments_reply` VALUES (16, 25, 10001, 10001, 'dwaewqe21312', '2024-11-06 17:27:57');
INSERT INTO `user_moments_reply` VALUES (17, 24, 10001, NULL, 'hahaha', '2024-11-06 18:21:05');
INSERT INTO `user_moments_reply` VALUES (18, 25, 10001, 10001, 'dawda', '2024-11-06 18:21:26');
INSERT INTO `user_moments_reply` VALUES (19, 26, 10001, NULL, 'awdawd', '2024-11-06 18:21:34');
INSERT INTO `user_moments_reply` VALUES (20, 29, 10001, NULL, '123213', '2024-11-06 18:21:38');
INSERT INTO `user_moments_reply` VALUES (21, 30, 10001, NULL, 'cascas', '2024-11-06 18:21:41');
INSERT INTO `user_moments_reply` VALUES (22, 30, 10001, 10001, '123123', '2024-11-06 18:22:41');
INSERT INTO `user_moments_reply` VALUES (23, 30, 10001, NULL, 'awadaw', '2024-11-06 18:22:46');
INSERT INTO `user_moments_reply` VALUES (24, 29, 10001, NULL, '12321', '2024-11-06 18:36:58');
INSERT INTO `user_moments_reply` VALUES (25, 29, 10001, 10001, 'aweawdwa', '2024-11-06 18:37:01');
INSERT INTO `user_moments_reply` VALUES (26, 30, 10009, 10001, '你好啊', '2024-11-06 18:53:40');
INSERT INTO `user_moments_reply` VALUES (27, 31, 10003, NULL, '21312312123daw', '2024-11-12 10:10:44');
INSERT INTO `user_moments_reply` VALUES (28, 31, 10003, 10003, 'awdawdwa', '2024-11-12 10:10:47');

-- ----------------------------
-- Table structure for user_moments_thumb
-- ----------------------------
DROP TABLE IF EXISTS `user_moments_thumb`;
CREATE TABLE `user_moments_thumb`  (
  `moments_id` int(0) NOT NULL,
  `user_id` int(0) NULL DEFAULT NULL COMMENT '点赞用户id',
  `created_at` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '点赞时间'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_moments_thumb
-- ----------------------------
INSERT INTO `user_moments_thumb` VALUES (25, 10001, '2024-11-06 16:06:28');
INSERT INTO `user_moments_thumb` VALUES (24, 10001, '2024-11-06 16:07:41');
INSERT INTO `user_moments_thumb` VALUES (25, 10009, '2024-11-06 16:15:51');
INSERT INTO `user_moments_thumb` VALUES (30, 10001, '2024-11-06 18:52:28');
INSERT INTO `user_moments_thumb` VALUES (30, 10009, '2024-11-06 18:53:34');
INSERT INTO `user_moments_thumb` VALUES (31, 10017, '2024-11-12 09:50:30');
INSERT INTO `user_moments_thumb` VALUES (31, 10003, '2024-11-12 10:10:40');

-- ----------------------------
-- Table structure for user_photo
-- ----------------------------
DROP TABLE IF EXISTS `user_photo`;
CREATE TABLE `user_photo`  (
  `photo_id` int(0) NOT NULL AUTO_INCREMENT,
  `user_id` int(0) NULL DEFAULT NULL COMMENT '用户id',
  `photo_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '相册名',
  `photo_desc` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '相册描述',
  `photo_cover` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '相册封面',
  `photo_size` int(0) NULL DEFAULT NULL COMMENT '相册图片数量',
  `created_at` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '相册创建时间',
  PRIMARY KEY (`photo_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = DYNAMIC;

-- ----------------------------
-- Records of user_photo
-- ----------------------------
INSERT INTO `user_photo` VALUES (1, 1, NULL, '爱丽丝打伞', NULL, NULL, NULL);
INSERT INTO `user_photo` VALUES (2, 1, NULL, '浅蓝色风格的图片', NULL, NULL, NULL);
INSERT INTO `user_photo` VALUES (3, 2, NULL, '爱丽丝打伞', NULL, NULL, NULL);
INSERT INTO `user_photo` VALUES (4, 2, NULL, '浅蓝色风格的图片', NULL, NULL, NULL);
INSERT INTO `user_photo` VALUES (5, 1, NULL, 'rurudo的画', NULL, NULL, NULL);
INSERT INTO `user_photo` VALUES (6, 10001, '壁纸', '该相册收藏着我喜欢的壁纸', NULL, 9, '2024-11-05 15:56:37');
INSERT INTO `user_photo` VALUES (14, 10001, 'dawd', 'dwadwadawawda', '1730811037236-899345026.jpg', 0, '2024-11-05 20:50:38');
INSERT INTO `user_photo` VALUES (15, 10001, 'daw1232', 'ewae1312312eaw', '1730812528098-270264592.jpg', 1, '2024-11-05 21:12:52');
INSERT INTO `user_photo` VALUES (17, 10017, '12312', '213', '1731376195016-705253240.png', 2, '2024-11-12 09:49:57');
INSERT INTO `user_photo` VALUES (18, 10017, '123', '213', '1731376214756-83884666.jpg', 0, '2024-11-12 09:50:15');

-- ----------------------------
-- Table structure for user_photo_image
-- ----------------------------
DROP TABLE IF EXISTS `user_photo_image`;
CREATE TABLE `user_photo_image`  (
  `image_id` int(0) NOT NULL AUTO_INCREMENT,
  `photo_id` int(0) NULL DEFAULT NULL COMMENT '相册id',
  `image` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '图像名',
  `upload_id` int(0) NULL DEFAULT NULL,
  `upload_at` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '上传时间',
  PRIMARY KEY (`image_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_photo_image
-- ----------------------------
INSERT INTO `user_photo_image` VALUES (2, 6, '1730799309528-966669221.png', 10001, '2024-11-04 17:35:09');
INSERT INTO `user_photo_image` VALUES (3, 6, '1730804579512-489509074.webp', 10001, '2024-11-05 19:02:59');
INSERT INTO `user_photo_image` VALUES (4, 6, '1730805024042-568762978.jpg', 10001, '2024-11-05 19:10:24');
INSERT INTO `user_photo_image` VALUES (6, 6, '1730805103132-764240407.jpg', 10001, '2024-11-05 19:11:43');
INSERT INTO `user_photo_image` VALUES (9, 6, '1730806700375-370676964.jpg', 10001, '2024-11-05 19:38:20');
INSERT INTO `user_photo_image` VALUES (10, 6, '1730807031324-899615762.jpg', 10001, '2024-11-05 19:43:51');
INSERT INTO `user_photo_image` VALUES (11, 6, '1730807033598-957913193.jpg', 10001, '2024-11-05 19:43:53');
INSERT INTO `user_photo_image` VALUES (12, 6, '1730807037843-584159556.jpg', 10001, '2024-11-05 19:43:57');
INSERT INTO `user_photo_image` VALUES (14, 6, '1730809398645-614177863.jpg', 10001, '2024-11-05 20:23:18');
INSERT INTO `user_photo_image` VALUES (15, 6, '1730810422700-5182422.png', 10001, '2024-11-05 20:40:22');
INSERT INTO `user_photo_image` VALUES (16, 15, '1730864293003-165170757.jpg', 10001, '2024-11-06 11:38:13');
INSERT INTO `user_photo_image` VALUES (17, 17, '1731376203888-227565873.jpg', 10017, '2024-11-12 09:50:03');
INSERT INTO `user_photo_image` VALUES (18, 17, '1731376206600-733974482.jpg', 10017, '2024-11-12 09:50:06');

-- ----------------------------
-- Table structure for user_space_visit
-- ----------------------------
DROP TABLE IF EXISTS `user_space_visit`;
CREATE TABLE `user_space_visit`  (
  `user_id` int(0) NOT NULL,
  `visit_id` int(0) NULL DEFAULT NULL COMMENT '访问用户',
  `visited_at` datetime(0) NULL DEFAULT NULL COMMENT '访问时间'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_space_visit
-- ----------------------------
INSERT INTO `user_space_visit` VALUES (10004, 10001, '2024-11-15 17:54:06');
INSERT INTO `user_space_visit` VALUES (10008, 10001, '2024-11-15 17:54:06');
INSERT INTO `user_space_visit` VALUES (10003, 10001, '2024-11-15 17:54:06');
INSERT INTO `user_space_visit` VALUES (10002, 10001, '2024-11-15 17:54:06');
INSERT INTO `user_space_visit` VALUES (10009, 10001, '2024-11-15 17:54:06');
INSERT INTO `user_space_visit` VALUES (10001, 10001, '2024-11-15 17:54:06');
INSERT INTO `user_space_visit` VALUES (10001, 10009, '2024-11-15 17:54:06');
INSERT INTO `user_space_visit` VALUES (10009, 10009, '2024-11-15 17:54:06');
INSERT INTO `user_space_visit` VALUES (10004, 10009, '2024-11-15 17:54:06');
INSERT INTO `user_space_visit` VALUES (10006, 10009, '2024-11-15 17:54:06');
INSERT INTO `user_space_visit` VALUES (10006, 10003, '2024-11-15 17:54:06');
INSERT INTO `user_space_visit` VALUES (10005, 10001, '2024-11-15 17:54:06');
INSERT INTO `user_space_visit` VALUES (10017, 10017, '2024-11-15 17:54:06');
INSERT INTO `user_space_visit` VALUES (10017, 10003, '2024-11-15 17:54:06');
INSERT INTO `user_space_visit` VALUES (10001, 10005, '2024-11-15 17:54:06');

-- ----------------------------
-- Table structure for user_stickers
-- ----------------------------
DROP TABLE IF EXISTS `user_stickers`;
CREATE TABLE `user_stickers`  (
  `user_sticker_id` int(0) NOT NULL AUTO_INCREMENT COMMENT '该贴纸的id',
  `user_id` int(0) NULL DEFAULT NULL COMMENT '持有该贴纸的用户id',
  `sticker_id` int(0) NULL DEFAULT NULL COMMENT '贴纸id',
  `get_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP(0) COMMENT '获得时间',
  `used` tinyint(1) NULL DEFAULT 0 COMMENT '是否使用中',
  PRIMARY KEY (`user_sticker_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10020 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_stickers
-- ----------------------------
INSERT INTO `user_stickers` VALUES (10001, 10001, 1, '2024-10-31 14:21:33', 0);
INSERT INTO `user_stickers` VALUES (10002, 10001, 4, '2024-11-01 10:48:34', 1);
INSERT INTO `user_stickers` VALUES (10003, 10002, 1, '2024-11-01 22:55:58', 0);
INSERT INTO `user_stickers` VALUES (10004, 10002, 3, '2024-11-01 00:00:00', 0);
INSERT INTO `user_stickers` VALUES (10005, 10003, 2, '2024-11-01 22:56:35', 1);
INSERT INTO `user_stickers` VALUES (10007, 10012, 1, '2024-11-10 23:21:06', 1);
INSERT INTO `user_stickers` VALUES (10012, 10012, 2, '2024-11-11 00:08:34', 0);
INSERT INTO `user_stickers` VALUES (10013, 10013, 1, '2024-11-12 07:09:46', 1);
INSERT INTO `user_stickers` VALUES (10014, 10014, 1, '2024-11-12 07:10:42', 1);
INSERT INTO `user_stickers` VALUES (10015, 10014, 2, '2024-11-12 07:12:57', 0);
INSERT INTO `user_stickers` VALUES (10016, 10015, 1, '2024-11-12 08:00:27', 1);
INSERT INTO `user_stickers` VALUES (10017, 10016, 1, '2024-11-12 09:40:07', 1);
INSERT INTO `user_stickers` VALUES (10018, 10017, 1, '2024-11-12 09:41:19', 1);
INSERT INTO `user_stickers` VALUES (10019, 10017, 2, '2024-11-12 09:49:28', 0);

-- ----------------------------
-- Table structure for user_stickers_info
-- ----------------------------
DROP TABLE IF EXISTS `user_stickers_info`;
CREATE TABLE `user_stickers_info`  (
  `user_id` int(0) NOT NULL COMMENT '用户id',
  `point` int(0) NULL DEFAULT NULL COMMENT '用户的贴纸积分',
  PRIMARY KEY (`user_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_stickers_info
-- ----------------------------
INSERT INTO `user_stickers_info` VALUES (10001, 3);
INSERT INTO `user_stickers_info` VALUES (10002, 4);
INSERT INTO `user_stickers_info` VALUES (10003, 2);
INSERT INTO `user_stickers_info` VALUES (10004, 0);
INSERT INTO `user_stickers_info` VALUES (10005, 0);
INSERT INTO `user_stickers_info` VALUES (10006, 0);
INSERT INTO `user_stickers_info` VALUES (10007, 0);
INSERT INTO `user_stickers_info` VALUES (10008, 0);
INSERT INTO `user_stickers_info` VALUES (10009, 0);
INSERT INTO `user_stickers_info` VALUES (10012, 3);
INSERT INTO `user_stickers_info` VALUES (10013, 1);
INSERT INTO `user_stickers_info` VALUES (10014, 3);
INSERT INTO `user_stickers_info` VALUES (10015, 1);
INSERT INTO `user_stickers_info` VALUES (10016, 1);
INSERT INTO `user_stickers_info` VALUES (10017, 3);

-- ----------------------------
-- Table structure for user_tag
-- ----------------------------
DROP TABLE IF EXISTS `user_tag`;
CREATE TABLE `user_tag`  (
  `user_id` int(0) NULL DEFAULT NULL COMMENT '从属用户',
  `tag_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '标签名',
  `tag_color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '标签背景颜色',
  `text_color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '标签字体颜色',
  `border_style` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL,
  `created_at` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0) ON UPDATE CURRENT_TIMESTAMP(0)
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_tag
-- ----------------------------
INSERT INTO `user_tag` VALUES (10001, '追番中', '#1E6ED0', '#FFFFFF', '#FFFFFF', '2024-11-04 14:36:30');
INSERT INTO `user_tag` VALUES (10001, '爱看电影', '#466EA8', '#FFFFFF', '#FFFFFF', '2024-11-04 14:48:31');
INSERT INTO `user_tag` VALUES (10009, '追番中', '#1E6ED0', '#FFFFFF', '#FFFFFF', '2024-11-05 00:45:43');
INSERT INTO `user_tag` VALUES (10009, '喜欢游泳', '#2C2C2D', '#FFFFFF', '#FF0000', '2024-11-05 00:52:33');
INSERT INTO `user_tag` VALUES (10009, '爱看电影', '#52647B', '#FFFFFF', '#FFFFFF', '2024-11-05 00:52:43');
INSERT INTO `user_tag` VALUES (10009, '读书', '#1E6ED0', '#FFFFFF', '#FFFFFF', '2024-11-07 17:23:53');
INSERT INTO `user_tag` VALUES (10009, '玩电脑', '#1E6ED0', '#FFFFFF', '#FFFFFF', '2024-11-07 17:23:59');
INSERT INTO `user_tag` VALUES (10009, '看电视', '#15345B', '#E9E2E2', '#FFFFFF', '2024-11-07 17:24:20');

-- ----------------------------
-- Table structure for user_tag_total
-- ----------------------------
DROP TABLE IF EXISTS `user_tag_total`;
CREATE TABLE `user_tag_total`  (
  `tag_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '标签名',
  `creator_id` int(0) NULL DEFAULT NULL COMMENT '创建该标签的用户',
  `total` int(0) NULL DEFAULT NULL COMMENT '拥有该标签的用户数量',
  `first_tag_color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '第一个创建该标签的用户所使用的标签颜色',
  `first_text_color` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '第一个创建该标签的用户所使用的文本颜色',
  `first_border_style` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '第一个创建该标签的用户所使用的边框样式',
  `created_at` datetime(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`tag_name`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_tag_total
-- ----------------------------
INSERT INTO `user_tag_total` VALUES ('喜欢旅游', 10001, 0, '#9B9494', '#FBFBFB', '#BC8686', '2024-11-12 10:52:48');
INSERT INTO `user_tag_total` VALUES ('喜欢游泳', 10009, 1, '#2C2C2D', '#FFFFFF', '#FF0000', '2024-11-05 00:52:33');
INSERT INTO `user_tag_total` VALUES ('爱看电影', 10001, 2, '#52647B', '#FFFFFF', '#FFFFFF', '2024-11-04 14:44:30');
INSERT INTO `user_tag_total` VALUES ('玩电脑', 10009, 1, '#1E6ED0', '#FFFFFF', '#FFFFFF', '2024-11-07 17:23:59');
INSERT INTO `user_tag_total` VALUES ('看电视', 10009, 1, '#15345B', '#E9E2E2', '#FFFFFF', '2024-11-07 17:24:20');
INSERT INTO `user_tag_total` VALUES ('读书', 10009, 1, '#1E6ED0', '#FFFFFF', '#FFFFFF', '2024-11-07 17:23:53');
INSERT INTO `user_tag_total` VALUES ('追番中', 10001, 2, '#1E6ED0', '#FFFFFF', '#FFFFFF', '2024-11-04 14:36:30');

-- ----------------------------
-- Procedure structure for AddGroupMemberTotal
-- ----------------------------
DROP PROCEDURE IF EXISTS `AddGroupMemberTotal`;
delimiter ;;
CREATE PROCEDURE `AddGroupMemberTotal`(IN groupId Int,IN num Int)
BEGIN
	UPDATE 
		group_chat
	SET
		member_total = member_total + num
	WHERE
		id = groupId;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for AddOneMessage
-- ----------------------------
DROP PROCEDURE IF EXISTS `AddOneMessage`;
delimiter ;;
CREATE PROCEDURE `AddOneMessage`(IN t_sender_id INT,
	IN t_receiver_id INT,
	IN t_room_id INT,
	IN t_content LONGTEXT,
	IN t_type VARCHAR(255),
	IN t_media_type VARCHAR(255),
	IN t_file_size INT,
	IN t_created_at TIMESTAMP)
BEGIN
	-- 声明用于存储所有成员信息的变量
		DECLARE userId INT;
		DECLARE cursorGroupIds CURSOR FOR
        SELECT user_id FROM group_members WHERE group_id = t_receiver_id AND user_id != t_sender_id;
	#插入消息
	INSERT message(id,sender_id,receiver_id,room_id,content,type,media_type,file_size,created_at) VALUES(null,t_sender_id,t_receiver_id,t_room_id,t_content,t_type,t_media_type,t_file_size,t_created_at);
	#更新统计数据
	UPDATE message_statistics SET total = total + 1 WHERE room_id = t_room_id;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for GetAllRoomUnreadMessage
-- ----------------------------
DROP PROCEDURE IF EXISTS `GetAllRoomUnreadMessage`;
delimiter ;;
CREATE PROCEDURE `GetAllRoomUnreadMessage`(IN userId INT)
BEGIN


DECLARE roomId INT;
DECLARE done INT DEFAULT FALSE;

-- 查询私人房间号
DECLARE privateRoomIds CURSOR FOR
SELECT 
    DISTINCT room_id
FROM 
    friend
WHERE
    user_id = userId;
-- 查询群聊房间号
DECLARE groupRoomIds CURSOR FOR
SELECT
	DISTINCT room_id
FROM 
	group_chat JOIN group_members ON group_chat.id = group_members.group_id;
-- 声明CONTINUE HANDLER来处理NOT FOUND条件
DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

-- 遍历私人房间号
OPEN privateRoomIds;
read_loop: LOOP
    FETCH privateRoomIds INTO roomId;
    IF done THEN
        LEAVE read_loop;
    END IF;
    -- 查询每个房间号内的未读信息
    CALL GetRoomUnreadMessage(roomId,userId);
END LOOP;
CLOSE privateRoomIds;

-- 重置游标
SET done = FALSE;
	
-- 遍历群聊房间号
OPEN groupRoomIds;
read_loop: LOOP
	FETCH groupRoomIds INTO roomId;
	IF done THEN
		LEAVE read_loop;
	END IF;
	-- 查询每个房间号内的未读信息
	CALL GetRoomUnreadMessage(roomId,userId);
END LOOP;
CLOSE groupRoomIds;

-- 	DECLARE roomId INT;
-- 	
-- 	-- 查询私人房间号
-- 	DECLARE privateRoomIds CURSOR FOR
-- 	SELECT 
-- 		DISTINCT room_id
-- 	FROM 
-- 		friend
-- 	WHERE
-- 		user_id = userId;
-- 	-- 查询群聊房间号
-- 	DECLARE groupRoomIds CURSOR FOR
-- 	SELECT
-- 		DISTINCT room_id
-- 	FROM 
-- 		group_chat JOIN group_members ON group_chat.id = group_members.group_id
-- 	WHERE
-- 		user_id = userId;
-- 		
-- 	-- 遍历私人房间号
--   OPEN privateRoomIds;
-- 	read_loop: LOOP
-- 		FETCH privateRoomIds INTO roomId;
-- 			-- 查询每个房间号内的未读信息
-- 			SELECT 1;
-- 	END LOOP;
--   CLOSE privateRoomIds;
-- 	
	
-- 	-- 遍历群聊房间号
-- 	OPEN groupRoomIds;
-- 	read_loop: LOOP
-- 		FETCH groupRoomIds INTO roomId;
-- 			-- 查询每个房间号内的未读信息
-- 			CALL GetRoomUnreadMessage(roomId,userId);
-- 	END LOOP;
-- 	CLOSE groupRoomIds;
	
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for GetEmojiShopInfo
-- ----------------------------
DROP PROCEDURE IF EXISTS `GetEmojiShopInfo`;
delimiter ;;
CREATE PROCEDURE `GetEmojiShopInfo`(IN shop_page INT)
BEGIN
	DECLARE calcShopPage INT;
	SELECT 
		*
	FROM 
		emoji_shop
	LIMIT shop_page,6;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for GetFriendInfoAndPhoto
-- ----------------------------
DROP PROCEDURE IF EXISTS `GetFriendInfoAndPhoto`;
delimiter ;;
CREATE PROCEDURE `GetFriendInfoAndPhoto`(IN userId Int,IN friendId Int)
BEGIN
		-- 查询好友信息
		SELECT 
			user.username AS username,
			user.name AS name,
			user.avatar AS avatar,
			user.phone AS phone,
			user.gender AS gender,
			user.signature AS signature,
			user.card_background AS card_background,
			user.online_status AS online_status,
			user.created_at AS created_at,
			user.last_login AS last_login,
			user.born_at AS born_at,
			room.type,
			friend.* 
		FROM 
			friend 
		JOIN 
			user ON friend.friend_id = user.id 
		JOIN
			room ON friend.room_id = room.id
		WHERE 
			user_id = userId AND friend_id = friendId;
		-- 查询好友照片墙
		SELECT *
		FROM 
			user_photo
		WHERE
			user_photo.user_id = friendId;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for GetOtherRoomFriend
-- ----------------------------
DROP PROCEDURE IF EXISTS `GetOtherRoomFriend`;
delimiter ;;
CREATE PROCEDURE `GetOtherRoomFriend`(IN roomId INT,IN userId INT)
BEGIN
	SELECT *
	FROM friend
	WHERE 
		friend.room_id = roomId AND friend.friend_id = userId;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for GetRoomAllMessage
-- ----------------------------
DROP PROCEDURE IF EXISTS `GetRoomAllMessage`;
delimiter ;;
CREATE PROCEDURE `GetRoomAllMessage`(IN roomId INT)
BEGIN
	SELECT 
		message.*,
		user.name,
		user.username,
		user.avatar
	FROM 
		message
	JOIN 
		user ON user.id = message.sender_id
	WHERE
		message.room_id = roomId
	ORDER BY
		message.created_at;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for GetRoomUnreadMessage
-- ----------------------------
DROP PROCEDURE IF EXISTS `GetRoomUnreadMessage`;
delimiter ;;
CREATE PROCEDURE `GetRoomUnreadMessage`(IN roomId INT,IN userId INT)
BEGIN


	DECLARE unreadMessageCount INT;
	DECLARE roomType VARCHAR(10);
	
	-- 分析房间号类型
	SELECT 
		type INTO roomType
	FROM
		room
	WHERE
		id = roomId;
	
	-- 获取未读信息数量
	IF roomType="私人" THEN
		SELECT 
			unread_msg_count INTO unreadMessageCount
		FROM 
			friend
		WHERE 
			room_id = roomId AND user_id = userId
		LIMIT 1;
		-- 清空未读统计
		UPDATE 
			friend
		SET
			unread_msg_count = 0
		WHERE
			room_id = roomId AND user_id = userId;
	ELSE
		SELECT 
			unread_msg_count INTO unreadMessageCount
		FROM 
			group_chat JOIN group_members ON group_chat.id = group_members.group_id
		WHERE 
			room_id = roomId AND user_id = userId
		
		LIMIT 1;
		-- 清空未读统计
		UPDATE 
			group_chat JOIN group_members ON group_chat.id = group_members.group_id
		SET
			unread_msg_count = 0
		WHERE
			room_id = roomId AND user_id = userId;
	END IF;
	-- 获取未读信息
	IF roomType="私人" THEN
		SELECT 
			message.*,
			user.name,
			user.username,
			user.avatar
		FROM 
			message
		JOIN 
			user ON user.id = message.sender_id
		WHERE
			message.room_id = roomId
		ORDER BY
			message.created_at DESC
		LIMIT unreadMessageCount;
	ELSE
		SELECT 
			message.*,
			user.name,
			user.username,
			user.avatar
		FROM 
			message
		JOIN 
			user ON user.id != message.sender_id
		WHERE
			message.room_id = roomId
		ORDER BY
			message.created_at DESC
		LIMIT unreadMessageCount;
	END IF;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for GetUserInfoAndPhoto
-- ----------------------------
DROP PROCEDURE IF EXISTS `GetUserInfoAndPhoto`;
delimiter ;;
CREATE PROCEDURE `GetUserInfoAndPhoto`(IN userId INT)
BEGIN
	-- 查询该用户信息 	
	SELECT user.id,username,name,avatar,phone,gender,signature,card_background,online_status,created_at,last_login,born_at
	FROM 
		user
	WHERE
		user.id = userId;
	-- 查询该用户分享相册
	SELECT *
	FROM 
		user_photo
	WHERE
		user_photo.user_id = userId;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for GetUserRequestsAsAdminOrOwner
-- ----------------------------
DROP PROCEDURE IF EXISTS `GetUserRequestsAsAdminOrOwner`;
delimiter ;;
CREATE PROCEDURE `GetUserRequestsAsAdminOrOwner`(IN userId INT)
BEGIN
-- 1.获取用户id
-- 2.根据提供的用户id查出用户在哪些群聊中是群主/管理员 获取这些群聊的id
-- 3.根据这些群聊id查询出相关的用户请求
    -- 声明变量
    DECLARE done INT DEFAULT FALSE;
    DECLARE groupId INT;
    DECLARE cursorGroupIds CURSOR FOR
        SELECT group_id FROM group_members WHERE user_id = userId AND (position = '群主' OR position = '管理员');
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = TRUE;

    -- 创建临时表存储群聊ID
    CREATE TEMPORARY TABLE IF NOT EXISTS temp_group_ids (id INT);

    -- 打开游标，遍历群聊ID
    OPEN cursorGroupIds;
    read_loop: LOOP
        FETCH cursorGroupIds INTO groupId;
        IF done THEN
            LEAVE read_loop;
        END IF;
        -- 将群聊ID插入临时表
        INSERT INTO temp_group_ids (id) VALUES (groupId);
    END LOOP;
    CLOSE cursorGroupIds;

    -- 查询相关的用户请求
    SELECT 
			gc.avatar AS group_avatar,
			gc.created_at AS group_created_at,
			gc.creator_id AS group_creator_id,
			gc.description AS group_description,
			gc.name AS group_name,
			gc.room_id AS group_room_id,
			gc.updated_at AS group_updated_at,
			user.username AS user_username,
			user.name AS user_name,
			user.avatar AS user_avatar,
			user.phone AS user_phone,
			user.gender AS user_gender,
			user.signature AS user_signature,
			user.card_background AS user_card_background,
			user.online_status AS user_online_status,
			user.created_at AS user_created_at,
			user.born_at AS user_born_at,
			user.last_login AS user_last_login,
			group_request.* 
		FROM 
			group_request 
		JOIN 
			user ON group_request.user_id=user.id 
		JOIN
			group_chat gc ON group_request.group_id=gc.id
		WHERE group_id IN (SELECT id FROM temp_group_ids) AND sender_id IS NULL;
    -- 删除临时表
    DROP TEMPORARY TABLE temp_group_ids;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for UpdateGroupMemberTotal
-- ----------------------------
DROP PROCEDURE IF EXISTS `UpdateGroupMemberTotal`;
delimiter ;;
CREATE PROCEDURE `UpdateGroupMemberTotal`(IN groupId Int,IN num Int)
BEGIN
	UPDATE 
		group_chat
	SET
		total_member = total_member + num
	WHERE
		id = groupId;
END
;;
delimiter ;

-- ----------------------------
-- Procedure structure for UpdateUnreadMessageCount
-- ----------------------------
DROP PROCEDURE IF EXISTS `UpdateUnreadMessageCount`;
delimiter ;;
CREATE PROCEDURE `UpdateUnreadMessageCount`(IN t_sender_id INT,
	IN t_receiver_id INT,
	IN t_room_id INT,
	IN t_type VARCHAR(255),
	IN t_unread INT,
	IN t_user_id INT)
BEGIN
	-- 声明用于存储所有成员信息的变量
		DECLARE userId INT;
	IF t_type = "私人" THEN	
		#如果是好友，只更新好友的未读信息数
		UPDATE 
			friend
		SET 
			unread_msg_count = unread_msg_count + t_unread
		WHERE
			user_id = t_receiver_id AND friend_id = t_sender_id AND room_id = t_room_id;
	ELSEIF t_type = "群聊" THEN
		#如果是群聊，更新群聊中该用户的未读信息数
			SELECT userId;
			-- 更新该用户的未读信息数量
			UPDATE 
				group_members
			SET 
				unread_msg_count = unread_msg_count + t_unread
			WHERE
				user_id = userId AND group_id = t_receiver_id;
	END IF;
END
;;
delimiter ;

SET FOREIGN_KEY_CHECKS = 1;
