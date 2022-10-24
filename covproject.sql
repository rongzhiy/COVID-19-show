/*
 Navicat Premium Data Transfer

 Source Server         : localhost_3306
 Source Server Type    : MySQL
 Source Server Version : 80019
 Source Host           : localhost:3306
 Source Schema         : covproject

 Target Server Type    : MySQL
 Target Server Version : 80019
 File Encoding         : 65001

 Date: 11/07/2022 14:29:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for details
-- ----------------------------
DROP TABLE IF EXISTS `details`;
CREATE TABLE `details`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `update_time` datetime(0) NULL DEFAULT NULL COMMENT '数据最后更新时间',
  `province` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '省',
  `city` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '市',
  `confirm` int(0) NULL DEFAULT NULL COMMENT '累计确诊',
  `now_confirm` int(0) NULL DEFAULT NULL COMMENT '现有确诊',
  `confirm_add` int(0) NULL DEFAULT NULL COMMENT '新增确诊',
  `wzz_add` int(0) NULL DEFAULT NULL COMMENT '新增无症状',
  `heal` int(0) NULL DEFAULT NULL COMMENT '累计治愈',
  `dead` int(0) NULL DEFAULT NULL COMMENT '累计死亡',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 518 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for event
-- ----------------------------
DROP TABLE IF EXISTS `event`;
CREATE TABLE `event`  (
  `event_time` datetime(0) NOT NULL COMMENT '日期',
  `event_description` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '事件',
  PRIMARY KEY (`event_time`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for history
-- ----------------------------
DROP TABLE IF EXISTS `history`;
CREATE TABLE `history`  (
  `ds` datetime(0) NOT NULL COMMENT '日期',
  `confirm` int(0) NULL DEFAULT NULL COMMENT '累计确诊',
  `confirm_add` int(0) NULL DEFAULT NULL COMMENT '当日新增确诊',
  `local_confirm` int(0) NULL DEFAULT NULL COMMENT '现有本土确诊',
  `local_confirm_add` int(0) NULL DEFAULT NULL COMMENT '本土当日新增确诊',
  `local_no_infect` int(0) NULL DEFAULT NULL COMMENT '现有本土无症状',
  `local_no_infect_add` int(0) NULL DEFAULT NULL COMMENT '本土当日新增无症状',
  `heal` int(0) NULL DEFAULT NULL COMMENT '累计治愈',
  `heal_add` int(0) NULL DEFAULT NULL COMMENT '当日新增治愈',
  `dead` int(0) NULL DEFAULT NULL COMMENT '累计死亡',
  `dead_add` int(0) NULL DEFAULT NULL COMMENT '当日新增死亡',
  PRIMARY KEY (`ds`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
