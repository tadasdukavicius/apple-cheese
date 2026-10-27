-- Sample catalogue of apple cheese (obuolių sūris), in Lithuanian. Prices are in EUR.
-- image_url paths are served by the frontend (apple-cheese/public/images).
-- Re-seeding: run `delete from public.products;` first (this also clears variants and carts).

with new_products as (
  insert into public.products (name, description, image_url, category, features) values
  (
    'Klasikinis obuolių sūris',
    'Tradicinis lietuviškas obuolių sūris: lėtai troškinti obuoliai, lengvai pasaldinti ir suspausti į tvirtą, pjaustomą luitą. Puikiai tinka prie arbatos, sūrių lentelės ar šviežios duonos.',
    '/images/products/classic.jpg', 'singles',
    array['Tik obuoliai ir cukrus', 'Be pieno produktų', 'Lėtai džiovintas', 'Ilgai išsilaiko']
  ),
  (
    'Obuolių sūris su čili',
    'Saldūs obuoliai su lėtai atsiskleidžiančiu čili pipirų aštrumu. Mėgstamiausias pasirinkimas prie aštresnių sūrių ir rūkytų mėsų.',
    '/images/products/chilli.jpg', 'singles',
    array['Šildantis, ne aštrus', 'Obuoliai, cukrus ir čili', 'Be pieno produktų', 'Puikiai tinka sūrių lentelei']
  ),
  (
    'Riešutinis obuolių sūris',
    'Su graikiniais ir lazdyno riešutais: sodrus skonis ir traškus kąsnis. Sudėtyje yra riešutų.',
    '/images/products/nuts.jpg', 'singles',
    array['Graikiniai ir lazdyno riešutai', 'Sodrus ir traškus', 'Be pieno produktų', 'Sudėtyje yra riešutų']
  ),
  (
    'Medumi saldintas obuolių sūris',
    'Gamintas senuoju būdu: saldintas medumi, o ne cukrumi, kaip ir pirmieji receptai. Minkštesnis, gilesnio, gėlių medaus skonio.',
    '/images/products/honey.jpg', 'singles',
    array['Saldintas medumi', 'Tradicinis receptas', 'Be rafinuoto cukraus', 'Be pieno produktų']
  ),
  (
    'Cinamoninis obuolių sūris',
    'Klasikinis obuolių sūris su šilta cinamono gaida. Skonis primena obuolių pyragą riekelėje.',
    '/images/products/cinnamon.jpg', 'singles',
    array['Šilti prieskoniai', 'Obuoliai, cukrus ir cinamonas', 'Be pieno produktų', 'Puikiai dera su kava']
  ),
  (
    'Degustacinė dovanų dėžutė',
    'Visi penki skoniai (klasikinis, čili, riešutų, medaus ir cinamono) vienoje dėžutėje, paruoštoje dovanoti.',
    '/images/products/gift-box.jpg', 'gift_sets',
    array['Visi penki skoniai', 'Paruošta dovanoti', 'Puikiai tinka pirmam susipažinimui', 'Su degustacijos kortele']
  )
  returning id, name
)
insert into public.product_variants (product_id, label, weight_g, price, sort_order)
select p.id, v.label, v.weight_g, v.price, v.sort_order
  from new_products p
  join (values
    ('Klasikinis obuolių sūris',         '150 g', 150,  5.90, 1),
    ('Klasikinis obuolių sūris',         '300 g', 300, 10.50, 2),
    ('Klasikinis obuolių sūris',         '600 g', 600, 19.00, 3),
    ('Obuolių sūris su čili',            '150 g', 150,  6.50, 1),
    ('Obuolių sūris su čili',            '300 g', 300, 11.50, 2),
    ('Riešutinis obuolių sūris',         '150 g', 150,  7.20, 1),
    ('Riešutinis obuolių sūris',         '300 g', 300, 12.90, 2),
    ('Medumi saldintas obuolių sūris',   '150 g', 150,  6.90, 1),
    ('Medumi saldintas obuolių sūris',   '300 g', 300, 12.20, 2),
    ('Cinamoninis obuolių sūris',        '150 g', 150,  6.20, 1),
    ('Cinamoninis obuolių sūris',        '300 g', 300, 11.00, 2),
    ('Degustacinė dovanų dėžutė',        '5 × 100 g', 500, 26.90, 1),
    ('Degustacinė dovanų dėžutė',        '5 × 200 g', 1000, 48.00, 2)
  ) as v(name, label, weight_g, price, sort_order) on v.name = p.name;
