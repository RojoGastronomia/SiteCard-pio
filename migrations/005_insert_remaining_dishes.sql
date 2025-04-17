-- Insert dishes for COFFEE BREAK VIP
WITH menu AS (SELECT id FROM menus WHERE name = 'COFFEE BREAK VIP')
INSERT INTO dishes (name, description, category, menu_id, price) VALUES
('Café Gourmet', 'Café gourmet especial, torrado e moído na hora', 'BEBIDAS', (SELECT id FROM menu), 7.00),
('Leite Integral/Desnatado', 'Leite orgânico quente', 'BEBIDAS', (SELECT id FROM menu), 5.00),
('Chocolate Belga', 'Chocolate quente premium com chocolate belga', 'BEBIDAS', (SELECT id FROM menu), 8.00),
('Suco de Laranja Natural', 'Suco de laranja orgânica espremido na hora', 'BEBIDAS', (SELECT id FROM menu), 6.00),
('Água Mineral Premium', 'Água mineral premium com e sem gás', 'BEBIDAS', (SELECT id FROM menu), 4.00),
('Croissant Especial', 'Croissant folhado artesanal', 'SNACKS', (SELECT id FROM menu), 6.50),
('Pão de Queijo Recheado', 'Pão de queijo gourmet com recheios especiais', 'SNACKS', (SELECT id FROM menu), 5.50),
('Mini Quiche Lorraine', 'Mini quiche com bacon e queijo gruyère', 'SNACKS', (SELECT id FROM menu), 7.00),
('Wrap de Salmão', 'Wrap com salmão defumado e cream cheese', 'MINI SANDUICHES', (SELECT id FROM menu), 8.00),
('Mini Sanduíche Gourmet', 'Mini sanduíche com presunto parma e brie', 'MINI SANDUICHES', (SELECT id FROM menu), 7.50),
('Bolo Red Velvet', 'Bolo red velvet com cobertura de cream cheese', 'BOLOS', (SELECT id FROM menu), 9.00),
('Bolo de Frutas Secas', 'Bolo artesanal com mix de frutas secas', 'BOLOS', (SELECT id FROM menu), 8.00),
('Macarons', 'Macarons franceses sortidos', 'SOBREMESAS', (SELECT id FROM menu), 6.00),
('Trufas Belgas', 'Trufas de chocolate belga', 'SOBREMESAS', (SELECT id FROM menu), 5.50);

-- Insert dishes for CAFÉ DA MANHÃ STANDARD
WITH menu AS (SELECT id FROM menus WHERE name = 'CAFÉ DA MANHÃ STANDARD')
INSERT INTO dishes (name, description, category, menu_id, price) VALUES
('Café', 'Café 100% arábica', 'BEBIDAS', (SELECT id FROM menu), 4.00),
('Leite', 'Leite integral ou desnatado', 'BEBIDAS', (SELECT id FROM menu), 3.00),
('Suco de Laranja', 'Suco de laranja natural', 'BEBIDAS', (SELECT id FROM menu), 4.00),
('Pão Francês', 'Pão francês fresquinho', 'PAES', (SELECT id FROM menu), 2.00),
('Pão de Forma', 'Pão de forma tradicional', 'PAES', (SELECT id FROM menu), 2.50),
('Manteiga', 'Manteiga com ou sem sal', 'FRIOS', (SELECT id FROM menu), 1.50),
('Queijo Minas', 'Queijo minas frescal', 'FRIOS', (SELECT id FROM menu), 3.00),
('Presunto', 'Presunto cozido', 'FRIOS', (SELECT id FROM menu), 3.50),
('Bolo Simples', 'Bolo caseiro', 'BOLOS', (SELECT id FROM menu), 4.00),
('Frutas da Estação', 'Mix de frutas frescas', 'FRUTAS', (SELECT id FROM menu), 3.00);

-- Insert dishes for CAFÉ DA MANHÃ PREMIUM
WITH menu AS (SELECT id FROM menus WHERE name = 'CAFÉ DA MANHÃ PREMIUM')
INSERT INTO dishes (name, description, category, menu_id, price) VALUES
('Café Gourmet', 'Café gourmet especial', 'BEBIDAS', (SELECT id FROM menu), 6.00),
('Leite Orgânico', 'Leite orgânico integral ou desnatado', 'BEBIDAS', (SELECT id FROM menu), 5.00),
('Suco de Laranja Natural', 'Suco de laranja orgânica', 'BEBIDAS', (SELECT id FROM menu), 5.00),
('Pão Integral', 'Pão integral artesanal', 'PAES', (SELECT id FROM menu), 3.50),
('Croissant', 'Croissant folhado', 'PAES', (SELECT id FROM menu), 4.50),
('Manteiga Especial', 'Manteiga francesa', 'FRIOS', (SELECT id FROM menu), 3.00),
('Queijo Brie', 'Queijo brie importado', 'FRIOS', (SELECT id FROM menu), 6.00),
('Presunto Parma', 'Presunto parma italiano', 'FRIOS', (SELECT id FROM menu), 7.00),
('Bolo Gourmet', 'Bolo gourmet do dia', 'BOLOS', (SELECT id FROM menu), 6.00),
('Salada de Frutas Especial', 'Salada de frutas com frutas nobres', 'FRUTAS', (SELECT id FROM menu), 5.00),
('Iogurte Natural', 'Iogurte natural orgânico', 'LATICINIOS', (SELECT id FROM menu), 4.00),
('Granola Artesanal', 'Mix de granola artesanal', 'CEREAIS', (SELECT id FROM menu), 4.50);

-- Insert dishes for ALMOÇO BUFFET STANDARD
WITH menu AS (SELECT id FROM menus WHERE name = 'ALMOÇO BUFFET STANDARD')
INSERT INTO dishes (name, description, category, menu_id, price) VALUES
('Arroz Branco', 'Arroz branco soltinho', 'ACOMPANHAMENTOS', (SELECT id FROM menu), 3.00),
('Feijão Carioca', 'Feijão carioca temperado', 'ACOMPANHAMENTOS', (SELECT id FROM menu), 3.50),
('Farofa', 'Farofa tradicional', 'ACOMPANHAMENTOS', (SELECT id FROM menu), 2.50),
('Salada Verde', 'Mix de folhas verdes', 'SALADAS', (SELECT id FROM menu), 4.00),
('Salada de Tomate', 'Salada de tomate com cebola', 'SALADAS', (SELECT id FROM menu), 3.50),
('Frango Grelhado', 'Filé de frango grelhado', 'CARNES', (SELECT id FROM menu), 8.00),
('Carne Assada', 'Carne assada ao molho', 'CARNES', (SELECT id FROM menu), 10.00),
('Peixe ao Molho', 'Filé de peixe ao molho de ervas', 'PEIXES', (SELECT id FROM menu), 9.00),
('Legumes Salteados', 'Mix de legumes salteados', 'LEGUMES', (SELECT id FROM menu), 4.00),
('Pudim de Leite', 'Pudim de leite tradicional', 'SOBREMESAS', (SELECT id FROM menu), 5.00);

-- Insert dishes for ALMOÇO BUFFET VIP
WITH menu AS (SELECT id FROM menus WHERE name = 'ALMOÇO BUFFET VIP')
INSERT INTO dishes (name, description, category, menu_id, price) VALUES
('Arroz Branco e Integral', 'Arroz branco e integral premium', 'ACOMPANHAMENTOS', (SELECT id FROM menu), 4.00),
('Feijão Especial', 'Feijão premium com bacon', 'ACOMPANHAMENTOS', (SELECT id FROM menu), 4.50),
('Farofa Gourmet', 'Farofa especial com bacon e amêndoas', 'ACOMPANHAMENTOS', (SELECT id FROM menu), 3.50),
('Mix de Folhas Nobres', 'Mix de folhas especiais e ervas', 'SALADAS', (SELECT id FROM menu), 6.00),
('Salada Caprese', 'Tomate, mozzarella de búfala e manjericão', 'SALADAS', (SELECT id FROM menu), 7.00),
('Salmão Grelhado', 'Salmão grelhado com ervas finas', 'PEIXES', (SELECT id FROM menu), 15.00),
('Filé Mignon', 'Filé mignon ao molho madeira', 'CARNES', (SELECT id FROM menu), 18.00),
('Legumes Grelhados', 'Mix de legumes grelhados com azeite', 'LEGUMES', (SELECT id FROM menu), 5.00),
('Petit Gateau', 'Petit gateau de chocolate com sorvete', 'SOBREMESAS', (SELECT id FROM menu), 12.00),
('Cheesecake', 'Cheesecake com calda de frutas vermelhas', 'SOBREMESAS', (SELECT id FROM menu), 10.00);

-- Insert dishes for ALMOÇO BUFFET PREMIUM
WITH menu AS (SELECT id FROM menus WHERE name = 'ALMOÇO BUFFET PREMIUM')
INSERT INTO dishes (name, description, category, menu_id, price) VALUES
('Risoto de Funghi', 'Risoto cremoso de funghi secchi', 'MASSAS', (SELECT id FROM menu), 12.00),
('Nhoque ao Pomodoro', 'Nhoque de batata ao molho pomodoro', 'MASSAS', (SELECT id FROM menu), 10.00),
('Salada Waldorf', 'Salada waldorf tradicional', 'SALADAS', (SELECT id FROM menu), 8.00),
('Carpaccio', 'Carpaccio de filé mignon com rúcula', 'ENTRADAS', (SELECT id FROM menu), 9.00),
('Medalhão de Filé', 'Medalhão de filé ao molho de vinho', 'CARNES', (SELECT id FROM menu), 20.00),
('Bacalhau Gratinado', 'Bacalhau gratinado com batatas', 'PEIXES', (SELECT id FROM menu), 22.00),
('Legumes Orgânicos', 'Mix de legumes orgânicos grelhados', 'LEGUMES', (SELECT id FROM menu), 6.00),
('Tiramisù', 'Tiramisù italiano tradicional', 'SOBREMESAS', (SELECT id FROM menu), 12.00),
('Crème Brûlée', 'Crème brûlée de baunilha', 'SOBREMESAS', (SELECT id FROM menu), 10.00);

-- Insert dishes for ALMOÇO EMPRATADO 3 TEMPOS
WITH menu AS (SELECT id FROM menus WHERE name = 'ALMOÇO EMPRATADO 3 TEMPOS')
INSERT INTO dishes (name, description, category, menu_id, price) VALUES
('Salada Caesar', 'Salada caesar com frango grelhado', 'ENTRADA', (SELECT id FROM menu), 8.00),
('Filé ao Molho Madeira', 'Filé mignon ao molho madeira com risoto', 'PRATO PRINCIPAL', (SELECT id FROM menu), 25.00),
('Mousse de Chocolate', 'Mousse de chocolate belga', 'SOBREMESA', (SELECT id FROM menu), 8.00);

-- Insert dishes for ALMOÇO EMPRATADO 4 TEMPOS
WITH menu AS (SELECT id FROM menus WHERE name = 'ALMOÇO EMPRATADO 4 TEMPOS')
INSERT INTO dishes (name, description, category, menu_id, price) VALUES
('Sopa de Cogumelos', 'Creme de cogumelos frescos', 'ENTRADA', (SELECT id FROM menu), 10.00),
('Salada Gourmet', 'Mix de folhas com queijo de cabra', 'SALADA', (SELECT id FROM menu), 12.00),
('Filé Wellington', 'Filé wellington com purê trufado', 'PRATO PRINCIPAL', (SELECT id FROM menu), 35.00),
('Petit Gateau', 'Petit gateau com sorvete de baunilha', 'SOBREMESA', (SELECT id FROM menu), 15.00);

-- Insert dishes for BRUNCH PREMIUM
WITH menu AS (SELECT id FROM menus WHERE name = 'BRUNCH PREMIUM')
INSERT INTO dishes (name, description, category, menu_id, price) VALUES
('Ovos Benedict', 'Ovos pochê com molho hollandaise', 'OVOS', (SELECT id FROM menu), 12.00),
('Waffles', 'Waffles belgas com frutas frescas', 'PADARIA', (SELECT id FROM menu), 10.00),
('Salmão Defumado', 'Salmão defumado com cream cheese', 'FRIOS', (SELECT id FROM menu), 15.00),
('Iogurte Grego', 'Iogurte grego com mel e granola', 'LATICINIOS', (SELECT id FROM menu), 8.00),
('Pães Artesanais', 'Seleção de pães artesanais', 'PADARIA', (SELECT id FROM menu), 6.00),
('Queijos Finos', 'Tábua de queijos importados', 'FRIOS', (SELECT id FROM menu), 18.00),
('Frutas Nobres', 'Seleção de frutas nobres', 'FRUTAS', (SELECT id FROM menu), 10.00);

-- Insert dishes for BRUNCH LIGHT
WITH menu AS (SELECT id FROM menus WHERE name = 'BRUNCH LIGHT')
INSERT INTO dishes (name, description, category, menu_id, price) VALUES
('Ovos Mexidos', 'Ovos mexidos com ervas', 'OVOS', (SELECT id FROM menu), 8.00),
('Panquecas Integrais', 'Panquecas integrais com mel', 'PADARIA', (SELECT id FROM menu), 7.00),
('Iogurte Natural', 'Iogurte natural com granola', 'LATICINIOS', (SELECT id FROM menu), 6.00),
('Pão Integral', 'Pão integral caseiro', 'PADARIA', (SELECT id FROM menu), 4.00),
('Queijo Branco', 'Queijo branco light', 'FRIOS', (SELECT id FROM menu), 5.00),
('Mix de Frutas', 'Salada de frutas da estação', 'FRUTAS', (SELECT id FROM menu), 6.00);

-- Insert dishes for ILHA GASTRONÔMICA STANDARD
WITH menu AS (SELECT id FROM menus WHERE name = 'ILHA GASTRONÔMICA STANDARD')
INSERT INTO dishes (name, description, category, menu_id, price) VALUES
('Massa ao Vivo', 'Massa preparada na hora', 'MASSAS', (SELECT id FROM menu), 12.00),
('Risotos', 'Risotos variados', 'RISOTOS', (SELECT id FROM menu), 10.00),
('Carnes Grelhadas', 'Carnes grelhadas na hora', 'CARNES', (SELECT id FROM menu), 15.00),
('Molhos Especiais', 'Seleção de molhos', 'MOLHOS', (SELECT id FROM menu), 3.00);

-- Insert dishes for ILHA GASTRONÔMICA VIP
WITH menu AS (SELECT id FROM menus WHERE name = 'ILHA GASTRONÔMICA VIP')
INSERT INTO dishes (name, description, category, menu_id, price) VALUES
('Sushi e Sashimi', 'Sushi e sashimi preparados na hora', 'JAPONESA', (SELECT id FROM menu), 20.00),
('Massa Trufada', 'Massa fresca com trufa', 'MASSAS', (SELECT id FROM menu), 18.00),
('Carnes Premium', 'Cortes nobres grelhados', 'CARNES', (SELECT id FROM menu), 25.00),
('Risoto de Lagosta', 'Risoto cremoso de lagosta', 'RISOTOS', (SELECT id FROM menu), 22.00),
('Molhos Gourmet', 'Seleção de molhos especiais', 'MOLHOS', (SELECT id FROM menu), 5.00);

-- Insert dishes for COQUETEL STANDARD
WITH menu AS (SELECT id FROM menus WHERE name = 'COQUETEL STANDARD')
INSERT INTO dishes (name, description, category, menu_id, price) VALUES
('Canapés Variados', 'Seleção de canapés', 'FINGER FOOD', (SELECT id FROM menu), 5.00),
('Mini Quiches', 'Mini quiches sortidas', 'FINGER FOOD', (SELECT id FROM menu), 4.00),
('Bolinho de Bacalhau', 'Bolinhos de bacalhau', 'FRITOS', (SELECT id FROM menu), 6.00),
('Mini Sanduíches', 'Variedade de mini sanduíches', 'SANDUICHES', (SELECT id FROM menu), 5.00);

-- Insert dishes for COQUETEL VIP
WITH menu AS (SELECT id FROM menus WHERE name = 'COQUETEL VIP')
INSERT INTO dishes (name, description, category, menu_id, price) VALUES
('Canapés Gourmet', 'Canapés com ingredientes premium', 'FINGER FOOD', (SELECT id FROM menu), 8.00),
('Casquinha de Siri', 'Casquinha de siri gratinada', 'FRUTOS DO MAR', (SELECT id FROM menu), 10.00),
('Mini Hambúrguer', 'Mini hambúrguer gourmet', 'FINGER FOOD', (SELECT id FROM menu), 9.00),
('Camarão Empanado', 'Camarão empanado com molho especial', 'FRUTOS DO MAR', (SELECT id FROM menu), 12.00),
('Bruschetta Premium', 'Bruschettas com topping gourmet', 'FINGER FOOD', (SELECT id FROM menu), 7.00); 