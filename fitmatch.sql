-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         8.0.27 - MySQL Community Server - GPL
-- SO del servidor:              Win64
-- HeidiSQL Versión:             12.7.0.6850
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Volcando estructura de base de datos para fitmatch
CREATE DATABASE IF NOT EXISTS `fitmatch` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `fitmatch`;

-- Volcando estructura para tabla fitmatch.bloqueos
CREATE TABLE IF NOT EXISTS `bloqueos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ip_address` varchar(50) NOT NULL,
  `fecha_hasta` timestamp NOT NULL DEFAULT (now()),
  `timestamp` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



-- Volcando estructura para tabla fitmatch.codigo_otp
CREATE TABLE IF NOT EXISTS `codigo_otp` (
  `id` int NOT NULL AUTO_INCREMENT,
  `valor` varchar(50) NOT NULL DEFAULT '',
  `fecha_caducado` timestamp NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `valor` (`valor`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;



-- Volcando estructura para tabla fitmatch.comentario_review
CREATE TABLE IF NOT EXISTS `comentario_review` (
  `comment_id` int NOT NULL AUTO_INCREMENT,
  `review_id` int NOT NULL,
  `user_id` int NOT NULL,
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`comment_id`),
  KEY `review_id` (`review_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `comentario_review_ibfk_1` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`review_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `comentario_review_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `usuario` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='tabla de comentario de reviews,  esta enlazado a un id y a un user que es el autor. El content es el texto del comentario';



-- Volcando estructura para tabla fitmatch.ejercicios
CREATE TABLE IF NOT EXISTS `ejercicios` (
  `exercise_id` int NOT NULL AUTO_INCREMENT,
  `muscle_group_id` int NOT NULL,
  `material_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text,
  `video` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`exercise_id`),
  KEY `FK_ejercicios_material` (`material_id`),
  KEY `FK_ejercicios_usuario` (`user_id`),
  KEY `FK_ejercicios_grupo_muscular` (`muscle_group_id`) USING BTREE,
  CONSTRAINT `FK_ejercicios_grupo_muscular` FOREIGN KEY (`muscle_group_id`) REFERENCES `grupo_muscular` (`muscle_group_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ejercicios_material` FOREIGN KEY (`material_id`) REFERENCES `material` (`material_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ejercicios_usuario` FOREIGN KEY (`user_id`) REFERENCES `usuario` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=199 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Lista de ejercicios';

-- Volcando datos para la tabla fitmatch.ejercicios: ~74 rows (aproximadamente)
DELETE FROM `ejercicios`;
INSERT INTO `ejercicios` (`exercise_id`, `muscle_group_id`, `material_id`, `user_id`, `name`, `description`, `video`) VALUES
	(112, 10, 1, NULL, 'Press de Banca', 'Ejercicio para el pecho con barra.', 'https://www.youtube.com/watch?v=SCVCLChPQFY'),
	(113, 12, 2, NULL, 'Curl de Bíceps ', 'Ejercicio para bíceps con mancuernas. ', 'https://www.youtube.com/watch?v=KsE-SViUVRI'),
	(114, 3, 1, NULL, 'Press Francés', 'Ejercicio para tríceps utilizando barra.', NULL),
	(115, 16, 5, NULL, 'Sentadillas', 'Ejercicio para cuádriceps utilizando el peso corporal.', NULL),
	(116, 4, 5, NULL, 'Dominadas', 'Ejercicio para dorsales utilizando el peso corporal.', NULL),
	(117, 6, 5, NULL, 'Crunches', 'Ejercicio para abdominales realizando contracciones.', NULL),
	(118, 7, 5, NULL, 'Elevaciones de Pierna', 'Ejercicio para aductores utilizando el peso corporal.', NULL),
	(119, 5, 5, NULL, 'Superman', 'Ejercicio para la espalda baja, fortaleciendo la zona lumbar.', NULL),
	(120, 9, 6, NULL, 'Burpees', 'Ejercicio de cuerpo completo que combina cardio y fuerza.', NULL),
	(121, 10, 1, NULL, 'Press de Pecho Inclinado', 'Ejercicio para el pecho superior con barra.', NULL),
	(122, 14, 1, NULL, 'Encogimientos de Hombros', 'Ejercicio para trapecios utilizando barra.', NULL),
	(123, 8, 3, NULL, 'Elevaciones de Talones', 'Ejercicio para gemelos utilizando kettlebell.', NULL),
	(124, 13, 2, NULL, 'Curl de Muñeca', 'Ejercicio para antebrazos con mancuernas.', NULL),
	(125, 15, 5, NULL, 'Rotaciones de Cuello', 'Ejercicio para mejorar la movilidad del cuello.', NULL),
	(126, 10, 2, NULL, 'Aperturas con Mancuernas', 'Ejercicio para pecho, realizado en banco plano con mancuernas.', 'https://www.youtube.com/watch?v=xyHdY99F640'),
	(127, 12, 1, NULL, 'Bíceps con Barra Z', 'Ejercicio para bíceps, utilizando barra Z para un mejor agarre.', NULL),
	(128, 3, 3, NULL, 'Extensiones de Tríceps con Kettlebell', 'Ejercicio para tríceps, realizado con kettlebell.', NULL),
	(129, 16, 7, NULL, 'Sentadillas en Máquina Smith', 'Ejercicio para cuádriceps, realizado en máquina Smith.', NULL),
	(130, 4, 4, NULL, 'Remo con Máquina', 'Ejercicio para fortalecer la espalda, realizado con máquina de remo.', NULL),
	(131, 6, 5, NULL, 'Planchas', 'Ejercicio isométrico para fortalecer el core.', NULL),
	(132, 7, 5, NULL, 'Estocadas', 'Ejercicio para piernas y glúteos, realizado con el peso corporal.', NULL),
	(133, 5, 5, NULL, 'Puente de Glúteos', 'Ejercicio para fortalecer la espalda baja y los glúteos.', NULL),
	(134, 9, 5, NULL, 'Mountain Climbers', 'Ejercicio de cuerpo completo que mejora la resistencia y fortalece el core.', NULL),
	(135, 10, 2, NULL, 'Press de Pecho con Mancuernas', 'Ejercicio para el pecho, realizado con mancuernas en banco plano.', NULL),
	(136, 4, 8, NULL, 'Peso Muerto con Barra Safety', 'Ejercicio para dorsales y espalda baja, realizado con barra safety.', NULL),
	(137, 3, 1, NULL, 'Dips en Paralelas', 'Ejercicio para tríceps, realizado en barras paralelas.', NULL),
	(138, 16, 2, NULL, 'Zancadas con Mancuernas', 'Ejercicio para piernas, realizado con mancuernas.', NULL),
	(139, 6, 5, NULL, 'Elevación de Piernas Colgado', 'Ejercicio para abdominales inferiores, colgado de una barra.', NULL),
	(140, 15, 5, NULL, 'Flexiones Laterales de Cuello', 'Ejercicio para los músculos del cuello, realizado con el peso de la cabeza.', NULL),
	(141, 10, 7, NULL, 'Press Inclinado en Máquina Smith', 'Ejercicio para la parte superior del pecho, realizado en máquina Smith.', 'https://www.youtube.com/watch?v=_sohWDT-Mg0'),
	(142, 12, 3, NULL, 'Curl de Martillo con Kettlebell', 'Ejercicio para bíceps, realizado con kettlebell.', NULL),
	(143, 3, 4, NULL, 'Tríceps en Polea Alta', 'Ejercicio para tríceps, realizado en máquina de polea.', NULL),
	(144, 16, 1, NULL, 'Sentadillas Frontales con Barra', 'Ejercicio para cuádriceps y core, realizado con barra al frente.', NULL),
	(145, 4, 2, NULL, 'Remo a una mano con Mancuerna', 'Ejercicio para la espalda, enfocado en un lado a la vez.', NULL),
	(146, 10, 2, NULL, 'Flexiones de Pecho', 'Ejercicio clásico para pecho realizado con peso corporal.', NULL),
	(147, 12, 5, NULL, 'Curl de Concentración', 'Ejercicio enfocado en bíceps, realizado con mancuernas, ideal para aislamiento.', NULL),
	(148, 3, 5, NULL, 'Fondos en Banco', 'Ejercicio para tríceps, realizado con el peso corporal utilizando un banco.', NULL),
	(149, 16, 3, NULL, 'Zancadas con Kettlebell', 'Ejercicio para piernas, realizado sosteniendo un kettlebell para agregar resistencia.', NULL),
	(150, 4, 1, NULL, 'Pullover con Barra', 'Ejercicio para dorsales, realizado con barra.', NULL),
	(151, 6, 5, NULL, 'Elevación de Cadera en Suelo', 'Ejercicio para fortalecer el core, especialmente los abdominales inferiores.', NULL),
	(152, 7, 5, NULL, 'Abducción de Cadera en Suelo', 'Ejercicio para los músculos abductores de la cadera, realizado en el suelo.', NULL),
	(153, 5, 5, NULL, 'Hiperextensiones', 'Ejercicio para fortalecer la espalda baja, realizado en banco de hiperextensiones o en suelo.', NULL),
	(154, 9, 6, NULL, 'Saltos de Caja', 'Ejercicio pliométrico de cuerpo completo que mejora la potencia y fuerza en las piernas.', NULL),
	(155, 10, 4, NULL, 'Press de Pecho en Máquina', 'Ejercicio para pecho, realizado en máquina de press de pecho.', NULL),
	(156, 14, 2, NULL, 'Encogimientos de Hombros con Mancuernas', 'Ejercicio para trapecios, realizado con mancuernas.', NULL),
	(157, 8, 5, NULL, 'Saltos en el Lugar', 'Ejercicio para gemelos y cardio, realizado con saltos en el lugar.', NULL),
	(158, 13, 5, NULL, 'Flexiones de Muñeca', 'Ejercicio para fortalecer los antebrazos, realizado con el peso del cuerpo.', NULL),
	(159, 15, 5, NULL, 'Rotaciones de Cabeza', 'Ejercicio para mejorar la movilidad y fortalecer los músculos del cuello.', NULL),
	(160, 10, 2, NULL, 'Aperturas con Mancuernas en Banco Inclinado', 'Ejercicio para la parte superior del pecho, realizado en banco inclinado con mancuernas.', 'https://www.youtube.com/watch?v=bhRTIO31e-E'),
	(161, 12, 4, NULL, 'Curl de Bíceps en Máquina', 'Ejercicio para bíceps, realizado en máquina específica para curl.', NULL),
	(162, 3, 7, NULL, 'Tríceps en Máquina Smith', 'Ejercicio para tríceps, realizado en máquina Smith.', NULL),
	(163, 16, 1, NULL, 'Sentadillas Búlgaras con Barra', 'Ejercicio para piernas, enfocado en cuádriceps y glúteos, realizado con barra.', NULL),
	(164, 4, 2, NULL, 'Remo Horizontal con Mancuernas', 'Ejercicio para espalda, enfocado en dorsales, realizado con mancuernas.', NULL),
	(165, 6, 5, NULL, 'V-Ups', 'Ejercicio abdominal intenso que trabaja todo el core, realizado con peso corporal.', NULL),
	(166, 10, 2, NULL, 'Pullover con Mancuerna', 'Ejercicio para trabajar pecho y dorsales, realizado con mancuerna.', NULL),
	(167, 12, 3, NULL, 'Curl de Bíceps con Kettlebell', 'Ejercicio para bíceps, realizado con kettlebell para un agarre diferente.', NULL),
	(168, 3, 1, NULL, 'Tríceps en Banco con Barra', 'Ejercicio para tríceps, realizado en un banco plano con barra.', NULL),
	(169, 16, 5, NULL, 'Estocadas Laterales', 'Ejercicio para piernas, enfocándose en los músculos aductores y abductores.', NULL),
	(170, 4, 4, NULL, 'Pulldown con Máquina', 'Ejercicio para dorsales, realizado con máquina de polea alta.', NULL),
	(171, 6, 5, NULL, 'Russian Twist', 'Ejercicio para oblicuos y core, realizado con el peso corporal o con peso adicional.', NULL),
	(172, 7, 5, NULL, 'Patada de Glúteo', 'Ejercicio para glúteos, realizado en cuadrupedia con el peso corporal.', NULL),
	(173, 5, 5, NULL, 'Good Morning', 'Ejercicio para espalda baja y isquiotibiales, realizado con el peso corporal o barra.', NULL),
	(174, 9, 6, NULL, 'Jumping Jacks', 'Ejercicio cardiovascular de cuerpo completo que mejora la coordinación y agilidad.', NULL),
	(175, 10, 3, NULL, 'Press de Pecho con Kettlebell', 'Ejercicio para el pecho, realizado con kettlebell para una mayor estabilidad.', NULL),
	(176, 14, 5, NULL, 'Elevación de Hombros', 'Ejercicio para trapecios, realizado con el peso corporal o mancuernas.', NULL),
	(177, 8, 5, NULL, 'Elevación de Talones de Pie', 'Ejercicio para gemelos, realizado en posición de pie con el peso corporal.', NULL),
	(178, 13, 2, NULL, 'Curl de Muñeca con Mancuernas', 'Ejercicio para antebrazos, realizado con mancuernas.', NULL),
	(179, 15, 5, NULL, 'Rotaciones de Cuello con Resistencia', 'Ejercicio para mejorar la movilidad y fortaleza del cuello, con resistencia manual.', NULL),
	(180, 10, 4, NULL, 'Press de Pecho Declinado en Máquina', 'Ejercicio para la parte inferior del pecho, realizado en máquina.', 'https://www.youtube.com/watch?v=QnALNVSjd0M'),
	(181, 12, 1, NULL, 'Curl de Bíceps 21s con Barra', 'Ejercicio de bíceps que combina movimientos parciales y completos, realizado con barra.', NULL),
	(182, 3, 7, NULL, 'Fondos en Máquina Smith', 'Ejercicio para tríceps, utilizando la barra de la máquina Smith para fondos.', NULL),
	(183, 16, 2, NULL, 'Prensa de Piernas', 'Ejercicio para cuádriceps y glúteos, realizado en máquina de prensa de piernas.', NULL),
	(184, 4, 1, NULL, 'Remo con Barra T', 'Ejercicio para la espalda, enfocado en los músculos dorsales, realizado con barra T.', NULL),
	(185, 6, 5, NULL, 'Plancha Lateral', 'Ejercicio para oblicuos y core, realizado en posición lateral sosteniendo el cuerpo en línea recta.', NULL),
	(197, 1, 1, 9, 'Press militar', 'Press de hombre vertical sobre la cabeza', ''),
	(198, 20, 1, 9, 'Peso Muerto Rumano en Barra', 'visagra de cadera\n\n\n', 'https://www.youtube.com/watch?v=UU6AS_iHPyI');

-- Volcando estructura para tabla fitmatch.ejercicios_detallados
CREATE TABLE IF NOT EXISTS `ejercicios_detallados` (
  `detailed_exercise_id` int NOT NULL AUTO_INCREMENT,
  `grouped_detailed_exercised_id` int NOT NULL,
  `exercise_id` int NOT NULL,
  `register_type_id` int NOT NULL,
  `notes` text,
  `order` int NOT NULL,
  PRIMARY KEY (`detailed_exercise_id`) USING BTREE,
  KEY `FK_ejercicios_detallados_ejercicios` (`exercise_id`),
  KEY `FK_ejercicios_detallados_tipo_de_registro` (`register_type_id`),
  KEY `FK_ejercicios_detallados_ejercicios_detallados_agrupados` (`grouped_detailed_exercised_id`),
  CONSTRAINT `FK_ejercicios_detallados_ejercicios` FOREIGN KEY (`exercise_id`) REFERENCES `ejercicios` (`exercise_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ejercicios_detallados_ejercicios_detallados_agrupados` FOREIGN KEY (`grouped_detailed_exercised_id`) REFERENCES `ejercicios_detallados_agrupados` (`grouped_detailed_exercised_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_ejercicios_detallados_tipo_de_registro` FOREIGN KEY (`register_type_id`) REFERENCES `tipo_de_registro` (`register_type_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=345 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando estructura para tabla fitmatch.ejercicios_detallados_agrupados
CREATE TABLE IF NOT EXISTS `ejercicios_detallados_agrupados` (
  `grouped_detailed_exercised_id` int NOT NULL AUTO_INCREMENT,
  `session_id` int DEFAULT NULL,
  `order` int NOT NULL,
  PRIMARY KEY (`grouped_detailed_exercised_id`),
  KEY `FK_ejercicios_detallados_agrupados_sesion_de_entrenamiento` (`session_id`),
  CONSTRAINT `FK_ejercicios_detallados_agrupados_sesion_de_entrenamiento` FOREIGN KEY (`session_id`) REFERENCES `sesion_de_entrenamiento` (`session_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=237 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando estructura para tabla fitmatch.etiquetas
CREATE TABLE IF NOT EXISTS `etiquetas` (
  `tag_id` int NOT NULL AUTO_INCREMENT,
  `template_id` int NOT NULL,
  `experience` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `interests` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `objectives` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `equipment` varchar(50) DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`tag_id`) USING BTREE,
  KEY `FK_emparejamiento_plantillas_de_entrenamiento` (`template_id`),
  CONSTRAINT `FK_emparejamiento_plantillas_de_entrenamiento` FOREIGN KEY (`template_id`) REFERENCES `plantillas_de_entrenamiento` (`template_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3033 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando estructura para tabla fitmatch.fotos_progreso
CREATE TABLE IF NOT EXISTS `fotos_progreso` (
  `id` int NOT NULL AUTO_INCREMENT,
  `measurement_id` int NOT NULL,
  `imagen` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_fotos_progreso_medidas` (`measurement_id`),
  CONSTRAINT `FK_fotos_progreso_medidas` FOREIGN KEY (`measurement_id`) REFERENCES `medidas` (`measurement_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando estructura para tabla fitmatch.grupo_muscular
CREATE TABLE IF NOT EXISTS `grupo_muscular` (
  `muscle_group_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `icon_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`muscle_group_id`) USING BTREE,
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando estructura para tabla fitmatch.logs
CREATE TABLE IF NOT EXISTS `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fecha` datetime NOT NULL DEFAULT (now()),
  `exito` bit(1) NOT NULL DEFAULT (0),
  `ip_address` varchar(50) NOT NULL DEFAULT '',
  `email` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando estructura para tabla fitmatch.material
CREATE TABLE IF NOT EXISTS `material` (
  `material_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '0',
  PRIMARY KEY (`material_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla fitmatch.material: ~8 rows (aproximadamente)
DELETE FROM `material`;
INSERT INTO `material` (`material_id`, `name`) VALUES
	(1, 'Barra'),
	(2, 'Mancuerna'),
	(3, 'Kettlebell'),
	(4, 'Maquina'),
	(5, 'Peso corporal'),
	(6, 'Cardio'),
	(7, 'Maquina smith'),
	(8, 'Barra safety'),
	(9, 'Otro');

-- Volcando estructura para tabla fitmatch.medidas
CREATE TABLE IF NOT EXISTS `medidas` (
  `measurement_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `left arm` double DEFAULT NULL,
  `right arm` double DEFAULT NULL,
  `shoulders` double DEFAULT NULL,
  `neck` double DEFAULT NULL,
  `chest` double DEFAULT NULL,
  `waist` double DEFAULT NULL,
  `upper_left_leg` double DEFAULT NULL,
  `upper_right_leg` double DEFAULT NULL,
  `left_calve` double DEFAULT NULL,
  `right_calve` double DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `left_forearm` double DEFAULT NULL,
  `right_forearm` double DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`measurement_id`),
  KEY `FK_medidas_usuario` (`user_id`),
  CONSTRAINT `FK_medidas_usuario` FOREIGN KEY (`user_id`) REFERENCES `usuario` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Volcando estructura para tabla fitmatch.me_gusta_comentarios
CREATE TABLE IF NOT EXISTS `me_gusta_comentarios` (
  `liked_comment_id` int NOT NULL AUTO_INCREMENT,
  `comment_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`liked_comment_id`),
  KEY `FK_me_gusta_comentarios_comentario_review` (`comment_id`),
  KEY `FK_me_gusta_comentarios_usuario` (`user_id`),
  CONSTRAINT `FK_me_gusta_comentarios_comentario_review` FOREIGN KEY (`comment_id`) REFERENCES `comentario_review` (`comment_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_me_gusta_comentarios_usuario` FOREIGN KEY (`user_id`) REFERENCES `usuario` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci ROW_FORMAT=DYNAMIC COMMENT='me gustas a reviews';


-- Volcando estructura para tabla fitmatch.me_gusta_reviews
CREATE TABLE IF NOT EXISTS `me_gusta_reviews` (
  `liked_review_id` int NOT NULL AUTO_INCREMENT,
  `review_id` int NOT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`liked_review_id`) USING BTREE,
  UNIQUE KEY `review_id_user_id` (`review_id`,`user_id`) USING BTREE,
  KEY `user_id` (`user_id`),
  KEY `review_id` (`review_id`) USING BTREE,
  CONSTRAINT `FK_me_gusta_reviews_reviews` FOREIGN KEY (`review_id`) REFERENCES `reviews` (`review_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `me_gusta_reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `usuario` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='me gustas a reviews';


-- Volcando estructura para tabla fitmatch.notificacion
CREATE TABLE IF NOT EXISTS `notificacion` (
  `notification_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `type` varchar(50) NOT NULL,
  `mensaje` text NOT NULL,
  `read` bit(1) NOT NULL DEFAULT (0),
  `timestamp` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`notification_id`) USING BTREE,
  KEY `FK_notificacion_usuario` (`user_id`),
  CONSTRAINT `FK_notificacion_usuario` FOREIGN KEY (`user_id`) REFERENCES `usuario` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando estructura para tabla fitmatch.perfil
CREATE TABLE IF NOT EXISTS `perfil` (
  `profile_id` int NOT NULL AUTO_INCREMENT,
  `rol` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`profile_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Roll de usuario\r\n';

-- Volcando datos para la tabla fitmatch.perfil: ~2 rows (aproximadamente)
DELETE FROM `perfil`;
INSERT INTO `perfil` (`profile_id`, `rol`) VALUES
	(1, 'admin'),
	(2, 'cliente');

-- Volcando estructura para tabla fitmatch.plantillas_de_entrenamiento
CREATE TABLE IF NOT EXISTS `plantillas_de_entrenamiento` (
  `template_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `template_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `picture` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` text,
  `public` bit(1) NOT NULL DEFAULT (0),
  `hidden` bit(1) NOT NULL DEFAULT (0),
  `fecha_creacion` date NOT NULL DEFAULT (now()),
  PRIMARY KEY (`template_id`),
  KEY `FK_plantillas_de_entrenamiento_usuario` (`user_id`),
  CONSTRAINT `FK_plantillas_de_entrenamiento_usuario` FOREIGN KEY (`user_id`) REFERENCES `usuario` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='plantillas de entrenamiento creadas por un usuario tendrán enlazadas sesiones de entrenamiento';

-- Volcando estructura para tabla fitmatch.registro_de_sesion
CREATE TABLE IF NOT EXISTS `registro_de_sesion` (
  `register_session_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `session_id` int NOT NULL,
  `date` timestamp NOT NULL DEFAULT (now()),
  `final_date` timestamp NULL DEFAULT NULL,
  `finished` bit(1) NOT NULL DEFAULT (0),
  PRIMARY KEY (`register_session_id`),
  KEY `FK_registro_sesion_usuario` (`user_id`),
  KEY `FK_registro_de_sesion_sesion_de_entrenamiento` (`session_id`),
  CONSTRAINT `FK_registro_de_sesion_sesion_de_entrenamiento` FOREIGN KEY (`session_id`) REFERENCES `sesion_de_entrenamiento` (`session_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_registro_sesion_usuario` FOREIGN KEY (`user_id`) REFERENCES `usuario` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=93 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Volcando estructura para tabla fitmatch.registro_set
CREATE TABLE IF NOT EXISTS `registro_set` (
  `register_set_id` int NOT NULL AUTO_INCREMENT,
  `register_session_id` int DEFAULT NULL,
  `set_id` int NOT NULL,
  `reps` int DEFAULT NULL,
  `weight` double DEFAULT NULL,
  `time` double DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`register_set_id`) USING BTREE,
  KEY `FK_registro_set_registro_de_sesion` (`register_session_id`),
  KEY `FK_registro_set_sets_ejercicios_entrada` (`set_id`),
  CONSTRAINT `FK_registro_set_registro_de_sesion` FOREIGN KEY (`register_session_id`) REFERENCES `registro_de_sesion` (`register_session_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_registro_set_sets_ejercicios_entrada` FOREIGN KEY (`set_id`) REFERENCES `sets_ejercicios_entrada` (`set_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=312 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Esta tabla es para las entradas de las sesiones de entrenamientos, que realizan  los usuarios tiene enlazada los ejercios de entrada';

-- Volcando estructura para tabla fitmatch.reviews
CREATE TABLE IF NOT EXISTS `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `template_id` int NOT NULL,
  `rating` double NOT NULL,
  `review_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `timestamp` timestamp NOT NULL DEFAULT (now()),
  PRIMARY KEY (`review_id`),
  KEY `FK_reviews_usuario` (`user_id`),
  KEY `FK_reviews_plantillas_de_entrenamiento` (`template_id`),
  CONSTRAINT `FK_reviews_plantillas_de_entrenamiento` FOREIGN KEY (`template_id`) REFERENCES `plantillas_de_entrenamiento` (`template_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_reviews_usuario` FOREIGN KEY (`user_id`) REFERENCES `usuario` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='review escrita a una rutina con su comentario y rating por parte de un usuario';


-- Volcando estructura para tabla fitmatch.rutinas_archivadas
CREATE TABLE IF NOT EXISTS `rutinas_archivadas` (
  `archived_id` int NOT NULL AUTO_INCREMENT,
  `template_id` int NOT NULL DEFAULT '0',
  `user_id` int NOT NULL DEFAULT '0',
  `hidden` bit(1) NOT NULL DEFAULT (0),
  PRIMARY KEY (`archived_id`),
  UNIQUE KEY `template_id_user_id` (`template_id`,`user_id`),
  KEY `FK_rutinas_archivadas_usuario` (`user_id`),
  CONSTRAINT `FK_rutinas_archivadas_plantillas_de_entrenamiento` FOREIGN KEY (`template_id`) REFERENCES `plantillas_de_entrenamiento` (`template_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_rutinas_archivadas_usuario` FOREIGN KEY (`user_id`) REFERENCES `usuario` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


-- Volcando estructura para tabla fitmatch.rutinas_guardadas
CREATE TABLE IF NOT EXISTS `rutinas_guardadas` (
  `saved_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `template_id` int NOT NULL,
  `hidden` bit(1) NOT NULL DEFAULT (0),
  PRIMARY KEY (`saved_id`),
  UNIQUE KEY `template_id` (`template_id`,`user_id`),
  KEY `FK_rutinas_guardadas_usuario` (`user_id`),
  CONSTRAINT `FK_rutinas_guardadas_plantillas_de_entrenamiento` FOREIGN KEY (`template_id`) REFERENCES `plantillas_de_entrenamiento` (`template_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_rutinas_guardadas_usuario` FOREIGN KEY (`user_id`) REFERENCES `usuario` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Un cliente puede guardar rutinas para consultarlos luegos';


-- Volcando estructura para tabla fitmatch.sesion_de_entrenamiento
CREATE TABLE IF NOT EXISTS `sesion_de_entrenamiento` (
  `session_id` int NOT NULL AUTO_INCREMENT,
  `template_id` int NOT NULL,
  `session_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `session_date` date NOT NULL DEFAULT (now()),
  `notes` text,
  `order` int NOT NULL DEFAULT '0',
  `activa` bit(1) NOT NULL,
  PRIMARY KEY (`session_id`),
  KEY `template_id` (`template_id`),
  CONSTRAINT `sesion_de_entrenamiento_ibfk_1` FOREIGN KEY (`template_id`) REFERENCES `plantillas_de_entrenamiento` (`template_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=225 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='tabla de sesiones de entrenamiento que se enlazan a las plantillas de entrenamiento. Cada sesión tiene una fecha y notas para el cliente, además tendrá enlazada ejercicios con detalle';

-- Volcando estructura para tabla fitmatch.sets_ejercicios_entrada
CREATE TABLE IF NOT EXISTS `sets_ejercicios_entrada` (
  `set_id` int NOT NULL AUTO_INCREMENT,
  `detailed_exercise_id` int DEFAULT NULL,
  `set_order` int NOT NULL,
  `reps` int DEFAULT NULL,
  `time` double DEFAULT NULL,
  `min_reps` int DEFAULT NULL,
  `max_reps` int DEFAULT NULL,
  `min_time` double DEFAULT NULL,
  `max_time` double DEFAULT NULL,
  PRIMARY KEY (`set_id`),
  KEY `FK_sets_ejercicios_entrada_ejercicios_detallados` (`detailed_exercise_id`),
  CONSTRAINT `FK_sets_ejercicios_entrada_ejercicios_detallados` FOREIGN KEY (`detailed_exercise_id`) REFERENCES `ejercicios_detallados` (`detailed_exercise_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=349 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='se enlazan con los ejecicios de entrada, podrán ser set x reps o por tiempo\r\n';

-- Volcando estructura para tabla fitmatch.tipo_de_registro
CREATE TABLE IF NOT EXISTS `tipo_de_registro` (
  `register_type_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`register_type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Volcando datos para la tabla fitmatch.tipo_de_registro: ~6 rows (aproximadamente)
DELETE FROM `tipo_de_registro`;
INSERT INTO `tipo_de_registro` (`register_type_id`, `name`) VALUES
	(1, 'Rango de repeticiones'),
	(2, 'Objetivo de repeticiones'),
	(3, 'Repeticiones maximas'),
	(4, 'ARMRAP'),
	(5, 'Tiempo'),
	(6, 'Rango de tiempo');

-- Volcando estructura para tabla fitmatch.usuario
CREATE TABLE IF NOT EXISTS `usuario` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `profile_id` int NOT NULL DEFAULT '2',
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `birth` date DEFAULT (now()),
  `system` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL DEFAULT 'metrico',
  `bio` text,
  `public` bit(1) NOT NULL DEFAULT (1),
  `banned` bit(1) NOT NULL DEFAULT (0),
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `email` (`email`),
  KEY `FK_usuario_perfil` (`profile_id`),
  CONSTRAINT `FK_usuario_perfil` FOREIGN KEY (`profile_id`) REFERENCES `perfil` (`profile_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='Un usuario tiene esta información básica';

-- Volcando datos para la tabla fitmatch.usuario: ~8 rows (aproximadamente)
DELETE FROM `usuario`;
INSERT INTO `usuario` (`user_id`, `profile_id`, `username`, `email`, `password`, `profile_picture`, `birth`, `system`, `bio`, `public`, `banned`) VALUES
	(20, 1, 'admin', 'admin', '16d11c1f3ce1fdf629637e0ed53cb33b2ca9e716e4acffed3a33425a9e4884ca', NULL, '2024-04-04', 'metrico', NULL, b'0', b'0');

	(22, 1, 'admin3', 'admin3', '16d11c1f3ce1fdf629637e0ed53cb33b2ca9e716e4acffed3a33425a9e4884ca', NULL, '2024-04-06', 'metrico', NULL, b'1', b'0');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
