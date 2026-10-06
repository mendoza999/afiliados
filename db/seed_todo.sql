-- Corre como postgres en el VPS:  psql afiliados -f db/seed_todo.sql
grant all on all tables in schema public to elijo;
alter default privileges in schema public grant all on tables to elijo;

insert into categories(country, slug, name, keyword) values
 ('es','auriculares-bluetooth','Auriculares Bluetooth','auriculares bluetooth'),
 ('es','smartwatch','Smartwatch','smartwatch'),
 ('es','altavoz-bluetooth','Altavoz Bluetooth','altavoz bluetooth'),
 ('es','monitor-4k','Monitor 4K','monitor 4k'),
 ('es','teclado-mecanico','Teclado Mecánico','teclado mecánico'),
 ('es','silla-gaming','Silla Gaming','silla gaming'),
 ('es','freidora-aire','Freidora de Aire','freidora de aire'),
 ('es','robot-aspirador','Robot Aspirador','robot aspirador'),
 ('es','cafetera-expreso','Cafetera Expreso','cafetera expreso'),
 ('es','aspiradora-vertical','Aspiradora sin Cable','aspiradora sin cable'),
 ('es','serum-vitamina-c','Sérum Vitamina C','sérum vitamina c'),
 ('es','lego-sets','LEGO','lego')
on conflict (slug) do update set name=excluded.name, keyword=excluded.keyword;
