-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 19, 2013 at 05:34 AM
-- Server version: 5.5.29
-- PHP Version: 5.4.6-1ubuntu1.2

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

--
-- Database: `personagoal-test`
--

-- --------------------------------------------------------

--
-- Table structure for table `Goal`
--

CREATE TABLE IF NOT EXISTS `Goal` (
  `goal_id` int(11) NOT NULL AUTO_INCREMENT,
  `completed_timestamp` datetime DEFAULT NULL,
  `due_date` datetime NOT NULL,
  `task_id` int(11) NOT NULL,
  PRIMARY KEY (`goal_id`),
  UNIQUE KEY `task_id_2` (`task_id`),
  KEY `task_id` (`task_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=90 ;

--
-- Dumping data for table `Goal`
--

INSERT INTO `Goal` (`goal_id`, `completed_timestamp`, `due_date`, `task_id`) VALUES
(0, NULL, '2013-05-06 08:00:00', 1),
(1, '2013-05-06 11:17:00', '2013-05-29 08:00:00', 2),
(2, NULL, '2013-04-05 11:17:00', 3),
(3, NULL, '0000-00-00 00:00:00', 4),
(4, NULL, '0000-00-00 00:00:00', 5),
(5, NULL, '0000-00-00 00:00:00', 6),
(6, NULL, '2013-05-01 00:00:00', 7),
(7, NULL, '0000-00-00 00:00:00', 8),
(8, NULL, '0000-00-00 00:00:00', 9),
(9, NULL, '0000-00-00 00:00:00', 10),
(10, NULL, '0000-00-00 00:00:00', 11),
(11, NULL, '0000-00-00 00:00:00', 12),
(12, NULL, '0000-00-00 00:00:00', 13),
(13, NULL, '0000-00-00 00:00:00', 14),
(14, NULL, '0000-00-00 00:00:00', 15),
(15, NULL, '2013-05-05 11:17:00', 16);

-- --------------------------------------------------------

--
-- Table structure for table `GoalTreeChildren`
--

CREATE TABLE IF NOT EXISTS `GoalTreeChildren` (
  `goal_id` int(11) NOT NULL,
  `child_id` int(11) NOT NULL,
  `root` int(11) NOT NULL,
  PRIMARY KEY (`goal_id`,`child_id`),
  KEY `child_id` (`child_id`),
  KEY `root` (`root`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `GoalTreeChildren`
--

INSERT INTO `GoalTreeChildren` (`goal_id`, `child_id`, `root`) VALUES
(1, 1, 1),
(1, 2, 1),
(1, 3, 1),
(2, 4, 1),
(2, 5, 1),
(3, 6, 1),
(3, 7, 1),
(3, 8, 1),
(7, 9, 1),
(7, 10, 1),
(9, 11, 1),
(10, 12, 1),
(10, 13, 1),
(10, 14, 1),
(15, 15, 15);

-- --------------------------------------------------------

--
-- Table structure for table `Goal_Project`
--

CREATE TABLE IF NOT EXISTS `Goal_Project` (
  `goal_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  PRIMARY KEY (`goal_id`,`project_id`),
  KEY `project_id` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Goal_Project`
--

INSERT INTO `Goal_Project` (`goal_id`, `project_id`) VALUES
(15, 0),
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 1),
(9, 1),
(10, 1),
(11, 1),
(12, 1),
(13, 1),
(14, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Project`
--

CREATE TABLE IF NOT EXISTS `Project` (
  `project_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(100) NOT NULL,
  `description` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`project_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=82 ;

--
-- Dumping data for table `Project`
--

INSERT INTO `Project` (`project_id`, `title`, `description`) VALUES
(0, 'Another Project', NULL),
(1, 'Test Project - Do not Delete', 'This is a test project');

-- --------------------------------------------------------

--
-- Table structure for table `Task`
--

CREATE TABLE IF NOT EXISTS `Task` (
  `task_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `description` varchar(800) NOT NULL,
  PRIMARY KEY (`task_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=157 ;

--
-- Dumping data for table `Task`
--

INSERT INTO `Task` (`task_id`, `title`, `description`) VALUES
(0, 'Linked Task', 'This should not be linked to a user but should be to a goal'),
(1, 'Unlinked Task', 'This task should be not be linked to a goal'),
(2, 'Test Task - Do not Delete', 'Do not delete'),
(3, 'Test Task 3 - Do not Delete', 'Do not delete'),
(4, 'Test Task - Do not Delete', 'Do not delete'),
(5, 'Test Task - Do not Delete', 'Do not delete'),
(6, 'Test Task - Do not Delete', 'Do not delete'),
(7, 'Test Task - Do not Delete', 'Do not delete'),
(8, 'Test Task - Do not Delete', 'Do not delete'),
(9, 'Test Task - Do not Delete', 'Do not delete'),
(10, 'Test Task - Do not Delete', 'Do not delete'),
(11, 'Test Task - Do not Delete', 'Do not delete'),
(12, 'Test Task - Do not Delete', 'Do not delete'),
(13, 'Test Task - Do not Delete', 'Do not delete'),
(14, 'Test Task - Do not Delete', 'Do not delete'),
(15, 'Test Task - Do not Delete', 'Do not delete'),
(16, 'Test Task - Do not Delete', 'Do not delete'),
(78, 'Test Title', 'Test'),
(79, 'Test Title', 'Test'),
(80, 'Test Title', 'Test');

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE IF NOT EXISTS `User` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=173 ;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`user_id`, `email`) VALUES
(1, 'checkLogin@test.com'),
(2, 'test2@test.com');

-- --------------------------------------------------------

--
-- Table structure for table `User_Detail`
--

CREATE TABLE IF NOT EXISTS `User_Detail` (
  `user_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `image_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `User_Detail`
--

INSERT INTO `User_Detail` (`user_id`, `name`, `role`, `image_path`) VALUES
(1, 'checkLogin', 'tester', NULL),
(2, 'Person 2', 'Testing', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `User_Goal`
--

CREATE TABLE IF NOT EXISTS `User_Goal` (
  `user_id` int(11) NOT NULL,
  `goal_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`goal_id`),
  KEY `goal_id` (`goal_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `User_Goal`
--

INSERT INTO `User_Goal` (`user_id`, `goal_id`) VALUES
(2, 1),
(1, 3),
(2, 3),
(1, 6),
(1, 7),
(1, 11),
(1, 13),
(1, 15);

-- --------------------------------------------------------

--
-- Table structure for table `User_Password`
--

CREATE TABLE IF NOT EXISTS `User_Password` (
  `user_id` int(11) NOT NULL,
  `password` char(32) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `User_Password`
--

INSERT INTO `User_Password` (`user_id`, `password`) VALUES
(1, '5f4dcc3b5aa765d61d8327deb882cf99'),
(2, '5f4dcc3b5aa765d61d8327deb882cf99');

-- --------------------------------------------------------

--
-- Table structure for table `User_Project`
--

CREATE TABLE IF NOT EXISTS `User_Project` (
  `user_id` int(11) NOT NULL,
  `project_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`project_id`),
  KEY `project_id` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `User_Project`
--

INSERT INTO `User_Project` (`user_id`, `project_id`) VALUES
(1, 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Goal`
--
ALTER TABLE `Goal`
  ADD CONSTRAINT `Goal_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `Task` (`task_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `GoalTreeChildren`
--
ALTER TABLE `GoalTreeChildren`
  ADD CONSTRAINT `GoalTreeChildren_ibfk_1` FOREIGN KEY (`goal_id`) REFERENCES `Goal` (`goal_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `GoalTreeChildren_ibfk_2` FOREIGN KEY (`child_id`) REFERENCES `Goal` (`goal_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `GoalTreeChildren_ibfk_3` FOREIGN KEY (`root`) REFERENCES `Goal` (`goal_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Goal_Project`
--
ALTER TABLE `Goal_Project`
  ADD CONSTRAINT `Goal_Project_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `Project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Goal_Project_ibfk_1` FOREIGN KEY (`goal_id`) REFERENCES `Goal` (`goal_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `User_Detail`
--
ALTER TABLE `User_Detail`
  ADD CONSTRAINT `User_Detail_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `User_Goal`
--
ALTER TABLE `User_Goal`
  ADD CONSTRAINT `User_Goal_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `User_Goal_ibfk_2` FOREIGN KEY (`goal_id`) REFERENCES `Goal` (`goal_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `User_Password`
--
ALTER TABLE `User_Password`
  ADD CONSTRAINT `User_Password_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `User_Project`
--
ALTER TABLE `User_Project`
  ADD CONSTRAINT `User_Project_ibfk_2` FOREIGN KEY (`project_id`) REFERENCES `Project` (`project_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `User_Project_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
