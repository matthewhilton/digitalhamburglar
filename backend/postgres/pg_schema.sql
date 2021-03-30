-- public.accounts definition

-- Drop table

-- DROP TABLE public.accounts;

CREATE TABLE public.accounts (
	id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	username varchar NOT NULL,
	"password" varchar NOT NULL,
	created date NOT NULL,
	CONSTRAINT accounts_pk PRIMARY KEY (id),
	CONSTRAINT accounts_un UNIQUE (username)
);


-- public.offers definition

-- Drop table

-- DROP TABLE public.offers;

CREATE TABLE public.offers (
	id int8 NOT NULL GENERATED ALWAYS AS IDENTITY,
	external_id varchar NOT NULL,
	title varchar NOT NULL,
	description varchar NULL,
	mcd_offerid int4 NOT NULL,
	mcd_propid int4 NOT NULL,
	last_checked timestamp(0) NOT NULL,
	account_id int8 NOT NULL,
	expires timestamp(0) NOT NULL,
	offerbucket varchar NOT NULL,
	image varchar NOT NULL DEFAULT 'default.png'::character varying,
	CONSTRAINT offers_pk PRIMARY KEY (id),
	CONSTRAINT offers_fk FOREIGN KEY (account_id) REFERENCES accounts(id) ON UPDATE CASCADE ON DELETE CASCADE
);