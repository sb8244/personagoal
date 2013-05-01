-- phpMyAdmin SQL Dump
-- version 3.4.11.1deb1
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: May 01, 2013 at 03:00 AM
-- Server version: 5.5.29
-- PHP Version: 5.4.6-1ubuntu1.2

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `personagoal-test`
--

-- --------------------------------------------------------

--
-- Table structure for table `Task`
--

CREATE TABLE IF NOT EXISTS `Task` (
  `task_id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(150) NOT NULL,
  `description` varchar(800) NOT NULL,
  PRIMARY KEY (`task_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=16 ;

--
-- Dumping data for table `Task`
--

INSERT INTO `Task` (`task_id`, `title`, `description`) VALUES
(1, 'Test Task - Do not Delete', 'Do not delete');

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE IF NOT EXISTS `User` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=122 ;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`user_id`, `email`) VALUES
(1, 'checkLogin@test.com');

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
(1, 'checkLogin', 'tester', NULL);

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
(1, '5f4dcc3b5aa765d61d8327deb882cf99');

-- --------------------------------------------------------

--
-- Table structure for table `User_Task`
--

CREATE TABLE IF NOT EXISTS `User_Task` (
  `user_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  PRIMARY KEY (`user_id`,`task_id`),
  KEY `task_id` (`task_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `User_Task`
--

INSERT INTO `User_Task` (`user_id`, `task_id`) VALUES
(1, 1);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `User_Detail`
--
ALTER TABLE `User_Detail`
  ADD CONSTRAINT `User_Detail_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `User_Password`
--
ALTER TABLE `User_Password`
  ADD CONSTRAINT `User_Password_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `User_Task`
--
ALTER TABLE `User_Task`
  ADD CONSTRAINT `User_Task_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `Task` (`task_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `User_Task_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
