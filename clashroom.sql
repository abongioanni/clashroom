-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Mag 22, 2020 alle 08:26
-- Versione del server: 10.4.11-MariaDB
-- Versione PHP: 7.4.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `clashroom`
--
CREATE DATABASE IF NOT EXISTS `clashroom` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `clashroom`;

-- --------------------------------------------------------

--
-- Struttura della tabella `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `nome` varchar(40) NOT NULL,
  `creatorId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `events`
--

CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `argomento` varchar(255) NOT NULL,
  `do` datetime NOT NULL,
  `teacherId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `studsub`
--

CREATE TABLE `studsub` (
  `id` int(11) NOT NULL,
  `studId` int(11) NOT NULL,
  `courseId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Struttura della tabella `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `nome` varchar(255) NOT NULL,
  `cognome` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `dob` date NOT NULL,
  `email` varchar(255) NOT NULL,
  `foto` varchar(255) NOT NULL,
  `st` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`,`courseId`,`do`);

--
-- Indici per le tabelle `studsub`
--
ALTER TABLE `studsub`
  ADD PRIMARY KEY (`studId`,`courseId`),
  ADD UNIQUE KEY `id` (`id`);

--
-- Indici per le tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`,`email`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la tabella `studsub`
--
ALTER TABLE `studsub`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT per la tabella `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
