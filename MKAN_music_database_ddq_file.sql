-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 13, 2021 at 04:36 PM
-- Server version: 10.4.18-MariaDB-log
-- PHP Version: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_nesbita`
--

-- --------------------------------------------------------

--
-- Table structure for table `Albums`
--

DROP TABLE IF EXISTS `Albums`;
CREATE TABLE `Albums` (
  `albumID` int(11) NOT NULL,
  `albumName` varchar(255) NOT NULL,
  `artist` int(11) NOT NULL,
  `recordLabel` int(11) NOT NULL,
  `releaseDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Albums`
--

INSERT INTO `Albums` (`albumID`, `albumName`, `artist`, `recordLabel`, `releaseDate`) VALUES
(1, 'Paranoid', 1, 1, '1970-09-18'),
(2, 'Chromatica', 2, 2, '2020-05-29'),
(3, 'Computer World', 3, 3, '1981-05-10');

-- --------------------------------------------------------

--
-- Table structure for table `Artists`
--

DROP TABLE IF EXISTS `Artists`;
CREATE TABLE `Artists` (
  `artistID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `recordLabel` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Artists`
--

INSERT INTO `Artists` (`artistID`, `name`, `recordLabel`) VALUES
(1, 'Black Sabbath', 1),
(2, 'Lady Gaga', 2),
(3, 'Kraftwerk', 3),
(4, 'The Databases', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `Label_Stream`
--

DROP TABLE IF EXISTS `Label_Stream`;
CREATE TABLE `Label_Stream` (
  `labelStreamID` int(11) NOT NULL,
  `streamingService` int(11) NOT NULL,
  `recordLabel` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Label_Stream`
--

INSERT INTO `Label_Stream` (`labelStreamID`, `streamingService`, `recordLabel`) VALUES
(1, 2, 1),
(2, 1, 3),
(3, 3, 2);

-- --------------------------------------------------------

--
-- Table structure for table `Record_Labels`
--

DROP TABLE IF EXISTS `Record_Labels`;
CREATE TABLE `Record_Labels` (
  `labelID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Record_Labels`
--

INSERT INTO `Record_Labels` (`labelID`, `name`) VALUES
(1, 'Vertigo'),
(2, 'Interscope'),
(3, 'Kling Klang');

-- --------------------------------------------------------

--
-- Table structure for table `Streaming_Services`
--

DROP TABLE IF EXISTS `Streaming_Services`;
CREATE TABLE `Streaming_Services` (
  `serviceID` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Streaming_Services`
--

INSERT INTO `Streaming_Services` (`serviceID`, `name`) VALUES
(1, 'Spotify'),
(2, 'Apple Music'),
(3, 'Pandora');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Albums`
--
ALTER TABLE `Albums`
  ADD PRIMARY KEY (`albumID`),
  ADD KEY `artist` (`artist`),
  ADD KEY `recordLabel` (`recordLabel`);

--
-- Indexes for table `Artists`
--
ALTER TABLE `Artists`
  ADD PRIMARY KEY (`artistID`),
  ADD KEY `recordLabel` (`recordLabel`);

--
-- Indexes for table `Label_Stream`
--
ALTER TABLE `Label_Stream`
  ADD PRIMARY KEY (`labelStreamID`),
  ADD KEY `streamingService` (`streamingService`),
  ADD KEY `recordLabel` (`recordLabel`);

--
-- Indexes for table `Record_Labels`
--
ALTER TABLE `Record_Labels`
  ADD PRIMARY KEY (`labelID`);

--
-- Indexes for table `Streaming_Services`
--
ALTER TABLE `Streaming_Services`
  ADD PRIMARY KEY (`serviceID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Albums`
--
ALTER TABLE `Albums`
  MODIFY `albumID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Artists`
--
ALTER TABLE `Artists`
  MODIFY `artistID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `Label_Stream`
--
ALTER TABLE `Label_Stream`
  MODIFY `labelStreamID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Record_Labels`
--
ALTER TABLE `Record_Labels`
  MODIFY `labelID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `Streaming_Services`
--
ALTER TABLE `Streaming_Services`
  MODIFY `serviceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Albums`
--
ALTER TABLE `Albums`
  ADD CONSTRAINT `Albums_ibfk_1` FOREIGN KEY (`artist`) REFERENCES `Artists` (`artistID`) ON DELETE CASCADE,
  ADD CONSTRAINT `Albums_ibfk_2` FOREIGN KEY (`recordLabel`) REFERENCES `Record_Labels` (`labelID`) ON DELETE CASCADE;

--
-- Constraints for table `Artists`
--
ALTER TABLE `Artists`
  ADD CONSTRAINT `Artists_ibfk_1` FOREIGN KEY (`recordLabel`) REFERENCES `Record_Labels` (`labelID`) ON DELETE SET NULL;

--
-- Constraints for table `Label_Stream`
--
ALTER TABLE `Label_Stream`
  ADD CONSTRAINT `Label_Stream_ibfk_1` FOREIGN KEY (`streamingService`) REFERENCES `Streaming_Services` (`serviceID`) ON DELETE CASCADE,
  ADD CONSTRAINT `Label_Stream_ibfk_2` FOREIGN KEY (`recordLabel`) REFERENCES `Record_Labels` (`labelID`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
