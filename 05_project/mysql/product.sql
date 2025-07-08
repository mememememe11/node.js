DROP TABLE IF EXISTS `t_category`;

-- t_category 테이블
CREATE TABLE `t_category` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `category1` VARCHAR(100) NOT NULL DEFAULT '',
  `category2` VARCHAR(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- category3 컬럼 추가
ALTER TABLE t_category 
ADD COLUMN category3 VARCHAR(100) DEFAULT '';

ALTER TABLE t_category
DROP COLUMN category3;


select *
from t_category;



    
# Dump of table t_image
# -----------------------

DROP TABLE IF EXISTS `t_image`;

select *
from t_image;
-- t_image 테이블
CREATE TABLE `t_image` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` INT(11) UNSIGNED NOT NULL,
  `type` INT(1) NOT NULL DEFAULT 1 COMMENT '1-썸네일, 2-제품이미지, 3-제품설명이미지',
  `path` VARCHAR(150) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `t_image_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `t_product`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS `t_product`;

select *
from t_product;
-- t_product 테이블
CREATE TABLE `t_product` (
`id` int(11) unsigned NOT NULL AUTO_INCREMENT, -- id 자동증가
`product_name` varchar(200) NOT NULL DEFAULT '', -- 값을 안넣으면 디폴트
`product_price` int(11) NOT NULL DEFAULT 0, -- not null은 값이 반드시 들어가야함
`delivery_price` int(11) NOT NULL DEFAULT 0,
`add_delivery_price` int(11) NOT NULL DEFAULT 0,
`tags` varchar(100) DEFAULT NULL,
`outbound_days` int(2) NOT NULL DEFAULT 5,
`seller_id` int(11) UNSIGNED NOT NULL DEFAULT 0,
`category_id` int(11) UNSIGNED NOT NULL DEFAULT 0,
`active_yn` enum('Y','N') NOT NULL DEFAULT 'Y',
`created_date` datetime NOT NULL DEFAULT current_timestamp(),
PRIMARY KEY (`id`),
KEY `seller_id` (`seller_id`),
KEY `category_id` (`category_id`),
CONSTRAINT `t_product_ibfk_1` FOREIGN KEY (`seller_id`) REFERENCES `t_seller`
(`id`),
CONSTRAINT `t_product_ibfk2` FOREIGN KEY (`category_id`) REFERENCES `t_category`
(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=UTF8;
-- alter table t_product alter column seller_id set default 0;
-- alter table t_product alter column category_id  set default 0; 

DROP TABLE IF EXISTS `t_seller`;
-- t_seller 테이블
CREATE TABLE `t_seller` (
`id` int(11) unsigned NOT NULL auto_INCREMENT,
`name` varchar(100) NOT NULL DEFAULT '',
`email` varchar(100) NOT NULL DEFAULT '',
`phone` varchar(20) NOT NULL DEFAULT '',
PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

select *
from t_seller;




DROP TABLE IF EXISTS `t_user`;
--- user 테이블
CREATE TABLE `t_user` (
`email` varchar(50) NOT NULL DEFAULT '',
`type` int(1) NOT NULL DEFAULT 1 COMMENT '1-buyer, 2-seller',
`nickname` varchar(50) DEFAULT NULL,
PRIMARY KEY (`email`)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


-- 상품(product), 카테고리(category), 이미지(image) 
select *
from t_seller;
insert into t_seller (name , email, phone)
values('seller01', '01@email.com', '010-0000-0000');

select *
from t_category;

insert into t_category (category1, category2, category3)
values('컴퓨터', '주요부품', '메인보드');
insert into t_category (category1, category2, category3)
values('컴퓨터', '주변기기', '마우스');








select *
from t_image;




select *
from t_category;

select *
from t_image;

select *
from t_product;

select *
from t_seller;

select *
from t_user;
-- -- -- -- -- --


-- 테이블 목록보기 
SHOW TABLES;

-- 테이블 구조 보기
DESC t_product;

-- 데이터 조회
SELECT * FROM t_product;

-- 데이터 삭제
-- DELETE FROM customers WHERE id = 1; --