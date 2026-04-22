DROP TYPE IF EXISTS categ_instrument;
DROP TYPE IF EXISTS tip_utilizare;

CREATE TYPE categ_instrument AS ENUM (
    'piane',
    'chitare_si_basuri',
    'tobe',
    'instrumente_cu_coarde'
);

CREATE TYPE tip_utilizare AS ENUM (
    'incepator',
    'intermediar',
    'profesionist',
    'copii'
);

CREATE TABLE IF NOT EXISTS instrumente (
   id SERIAL PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   greutate INT NOT NULL CHECK (greutate >= 0),
   tip_produs categ_instrument DEFAULT 'piane',
   nr_componente INT NOT NULL CHECK (nr_componente >= 0),
   categorie tip_utilizare DEFAULT 'incepator',
   materiale VARCHAR[],
   este_electric BOOLEAN NOT NULL DEFAULT FALSE,
   imagine VARCHAR(300),
   data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT INTO instrumente (
   nume, descriere, pret, greutate, tip_produs,
   nr_componente, categorie, materiale, este_electric, imagine
)
VALUES 

('Pian Nord Stage', 'Pian digital profesional pentru scenă.', 18500, 18500, 'piane', 88, 'profesionist', '{"metal","plastic","lemn"}', TRUE, 'pian_nord_stage.jpg'),

('Pian Roland', 'Pian digital compact pentru studiu.', 4200, 12000, 'piane', 88, 'incepator', '{"plastic","lemn"}', TRUE, 'pian_roland.jpg'),

('Pian Steinway', 'Pian cu coadă de concert.', 450000, 480000, 'piane', 88, 'profesionist', '{"lemn mesteacan","lemn molid","otel","fildes"}', FALSE, 'pian_steinway.png'),

('Pian Yamaha', 'Pian digital cu mecanică realistă.', 6500, 15000, 'piane', 88, 'intermediar', '{"lemn","plastic","metal"}', TRUE, 'pian_yamaha.jpg'),

('Contrabas', 'Instrument cu sunet grav de orchestră.', 8900, 10000, 'instrumente_cu_coarde', 4, 'profesionist', '{"lemn paltin","lemn molid","metal"}', FALSE, 'contrabas.jpg'),

('Vioară', 'Vioară acustică pentru începători.', 1200, 500, 'instrumente_cu_coarde', 4, 'incepator', '{"lemn artar","lemn molid","ebonita"}', FALSE, 'vioara.jpg'),

('Violă', 'Instrument orchestral mediu.', 1500, 650, 'instrumente_cu_coarde', 4, 'intermediar', '{"lemn artar","lemn molid"}', FALSE, 'viola.jpg'),

('Violoncel', 'Instrument mare cu sunet profund.', 4500, 3500, 'instrumente_cu_coarde', 4, 'profesionist', '{"lemn paltin","lemn molid","metal"}', FALSE, 'violoncel.jpg'),

('Ukulele', 'Instrument mic cu 4 corzi.', 250, 400, 'chitare_si_basuri', 4, 'copii', '{"lemn mahon","plastic"}', FALSE, 'ukulela.jpg'),

('Tobe electronice', 'Set digital pentru apartament.', 3200, 25000, 'tobe', 7, 'incepator', '{"cauciuc","plastic","metal"}', TRUE, 'tobe_electronice.jpg'),

('Tobe acustice maro', 'Set profesional din lemn.', 5500, 45000, 'tobe', 5, 'profesionist', '{"lemn mesteacan","otel"}', FALSE, 'tobe_maro.jpg'),

('Tobe mov', 'Set pentru rock.', 4800, 42000, 'tobe', 5, 'intermediar', '{"lemn plop","otel"}', FALSE, 'tobe_mov.png'),

('Tobe roșii', 'Set compact de jazz.', 3900, 38000, 'tobe', 4, 'incepator', '{"lemn mahon","otel"}', FALSE, 'tobe_rosii.jpg'),

('Chitară acustică', 'Chitară clasică pentru începători.', 950, 2100, 'instrumente_cu_coarde', 6, 'incepator', '{"lemn molid","lemn mahon"}', FALSE, 'chitara_acustica.jpg'),

('Chitară bass', 'Bass electric pentru rock.', 1800, 3800, 'instrumente_cu_coarde', 4, 'intermediar', '{"lemn arin","lemn artar","metal"}', TRUE, 'chitara_bass.jpg'),

('Chitară electrică', 'Chitară versatilă electrică.', 2400, 3400, 'instrumente_cu_coarde', 6, 'profesionist', '{"lemn frasin","lemn artar","metal"}', TRUE, 'chitara_electrica.jpg');