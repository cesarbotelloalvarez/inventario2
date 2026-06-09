UPDATE "Articulo"
SET "categoria" = 'PPF'
WHERE "categoria" NOT IN ('PPF', 'Vinil', 'Polarizado', 'Home', 'Detallado', 'Armado');

