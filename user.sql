/*
Navicat MySQL Data Transfer

Source Server         : test
Source Server Version : 50729
Source Host           : localhost:3306
Source Database       : testdata

Target Server Type    : MYSQL
Target Server Version : 50729
File Encoding         : 65001

Date: 2021-11-18 15:58:08
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('kk', '156@qq.com', '123456', 'stu', null);
INSERT INTO `user` VALUES ('zk', '3378247303@qq.com', '105343', 'tea', '785276');
INSERT INTO `user` VALUES ('试验', 'zhangkai_0109@126.com', '123456', 'stu', null);
INSERT INTO `user` VALUES ('zz', '100@qq.com', '123456', 'tea', null);
INSERT INTO `user` VALUES ('苏子西', '2358663604@qq.com', '103160', 'stu', null);
INSERT INTO `user` VALUES ('chl', '', '103160', 'tea', null);
INSERT INTO `user` VALUES ('zjg', '1149979508@qq.com', '105343', 'tea', '483086');
INSERT INTO `user` VALUES ('test', '1579672344@qq.com', '123456', 'tea', '736102');
INSERT INTO `user` VALUES ('QK', 'qink@whu.edu.cn', 'isip7273', 'tea', null);
INSERT INTO `user` VALUES ('我是学生', 'test@qq.com', '123456', 'stu', null);
INSERT INTO `user` VALUES ('我是老师', 'testteacher@qq.com', '123456', 'tea', null);
