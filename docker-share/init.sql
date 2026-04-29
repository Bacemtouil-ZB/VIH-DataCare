-- =========================================================
-- INIT SQL DOCKER
-- =========================================================
-- Basee sur la sauvegarde PostgreSQL fournie (format PGDMP).
-- Ce script initialise une base vide pour le deploiement Docker.
-- Il charge le schema restaure, les vues BI, les referentiels,
-- les comptes applicatifs et le stock minimal de demonstration.
-- Version source de la sauvegarde: PostgreSQL 17.7.
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.7
-- Dumped by pg_dump version 17.7

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: action_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.action_enum AS ENUM (
    'LOGIN_SUCCESS',
    'LOGIN_FAILED',
    'PATIENT_CREATE',
    'PATIENT_UPDATE',
    'PATIENT_VIEW',
    'SOCIAL_CREATE',
    'SOCIAL_UPDATE',
    'SOCIAL_VIEW',
    'VIH_CREATE',
    'VIH_UPDATE',
    'VIH_VIEW',
    'EXAMEN_CLINIQUE_CREATE',
    'EXAMEN_CLINIQUE_UPDATE',
    'EXAMEN_CLINIQUE_VIEW',
    'OBSERVATION_CREATE',
    'OBSERVATION_UPDATE',
    'OBSERVATION_VIEW',
    'HABITUDE_DE_VIE_CREATE',
    'HABITUDE_DE_VIE_UPDATE',
    'HABITUDE_DE_VIE_VIEW',
    'SIGNE_CLINIQUE_VIEW',
    'SIGNE_CLINIQUE_UPDATE',
    'SIGNE_CLINIQUE_CREATE',
    'SIGNE_FONCTIONNEL_VIEW',
    'SIGNE_FONCTIONNEL_UPDATE',
    'SIGNE_FONCTIONNEL_CREATE',
    'STOCK_CREATE',
    'STOCK_UPDATE',
    'STOCK_VIEW',
    'RENDEZ_VOUS_CREATE',
    'RENDEZ_VOUS_UPDATE',
    'RENDEZ_VOUS_VIEW',
    'STOCK_DELETE',
    'BILAN_EXAMEN_CREATE',
    'BILAN_EXAMEN_VIEW',
    'BILAN_EXAMEN_UPDATE',
    'RESULTAT_BIOLOGIQUE_CREATE',
    'RESULTAT_BIOLOGIQUE_VIEW',
    'RESULTAT_BIOLOGIQUE_UPDATE',
    'PRESCRIPTION_CREATE',
    'PRESCRIPTION_VALIDER',
    'PRESCRIPTION_VALIDER_MODIFIEE',
    'PERMISSION_SET',
    'DOCTOR_CONCLUSION_CREATE',
    'DOCTOR_CONCLUSION_UPDATE',
    'DOCTOR_CONCLUSION_VIEW',
    'DOCTOR_CONCLUSION_LIST_VIEW',
    'EMERGENCY_CONTACT_LIST_VIEW',
    'EMERGENCY_CONTACT_VIEW',
    'EMERGENCY_CONTACT_CREATE',
    'EMERGENCY_CONTACT_UPDATE',
    'EMERGENCY_CONTACT_DELETE',
    'PATIENT_PRESCRIPTION_LIST_VIEW',
    'SUIVI_BIOLOGIQUE_KPIS_VIEW',
    'SUIVI_BIOLOGIQUE_CD4_VIEW',
    'SUIVI_BIOLOGIQUE_CV_VIEW',
    'SUIVI_BIOLOGIQUE_PERIODES_ARV_VIEW',
    'SUIVI_BIOLOGIQUE_TABLEAU_VIEW',
    'SUIVI_THERAPEUTIQUE_VIEW_BY_PATIENT',
    'SUIVI_THERAPEUTIQUE_VIEW_BY_NUMERO',
    'SUIVI_THERAPEUTIQUE_SYNC'
);


ALTER TYPE public.action_enum OWNER TO postgres;

--
-- Name: activite_professionnelle_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.activite_professionnelle_enum AS ENUM (
    'etudiant',
    'salarie_public',
    'salarie_prive',
    'travailleur_independant',
    'profession_liberale',
    'artisan',
    'commercant',
    'agriculteur',
    'sans_emploi',
    'retraite',
    'personne_au_foyer',
    'professionnelle_du_sexe'
);


ALTER TYPE public.activite_professionnelle_enum OWNER TO postgres;

--
-- Name: niveau_etude_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.niveau_etude_enum AS ENUM (
    'sans_instruction',
    'primaire',
    'secondaire',
    'formation_professionnelle',
    'baccalaureat',
    'licence',
    'master',
    'doctorat'
);


ALTER TYPE public.niveau_etude_enum OWNER TO postgres;

--
-- Name: probleme_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.probleme_enum AS ENUM (
    'precarite_logement',
    'instabilite_professionnelle',
    'difficultes_financieres',
    'conflits_familiaux',
    'isolement_social',
    'violence_domestique',
    'problemes_transport',
    'difficulte_acces_soins'
);


ALTER TYPE public.probleme_enum OWNER TO postgres;

--
-- Name: role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.role_enum AS ENUM (
    'pharmacien',
    'medecin',
    'analyste',
    'admin',
    'patient'
);


ALTER TYPE public.role_enum OWNER TO postgres;

--
-- Name: situation_social_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.situation_social_enum AS ENUM (
    'celibataire',
    'marie',
    'divorce',
    'veuf',
    'autre'
);


ALTER TYPE public.situation_social_enum OWNER TO postgres;

--
-- Name: type_ressource_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.type_ressource_enum AS ENUM (
    'salaire',
    'revenu_independant',
    'aide_sociale',
    'allocation_familiale',
    'pension_retraite',
    'soutien_familial',
    'aucune_ressource'
);


ALTER TYPE public.type_ressource_enum OWNER TO postgres;

--
-- Name: update_patients_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_patients_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_patients_updated_at() OWNER TO postgres;

--
-- Name: update_prescription_medicale_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_prescription_medicale_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at := CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_prescription_medicale_updated_at() OWNER TO postgres;

--
-- Name: update_suivi_therapeutique_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_suivi_therapeutique_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_suivi_therapeutique_updated_at() OWNER TO postgres;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.addresses (
    id integer NOT NULL,
    postal_code_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    exact_address text
);


ALTER TABLE public.addresses OWNER TO postgres;

--
-- Name: addresses_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.addresses_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.addresses_id_seq OWNER TO postgres;

--
-- Name: addresses_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.addresses_id_seq OWNED BY public.addresses.id;


--
-- Name: antecedent_family; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.antecedent_family (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    diabete boolean DEFAULT false NOT NULL,
    hypertension boolean DEFAULT false NOT NULL,
    cardiopathies boolean DEFAULT false NOT NULL,
    insuffisance_renale boolean DEFAULT false NOT NULL,
    maladies_hepatiques boolean DEFAULT false NOT NULL,
    asthme_bpco boolean DEFAULT false NOT NULL,
    cancers boolean DEFAULT false NOT NULL,
    autres text,
    remarque text,
    created_by integer NOT NULL,
    updated_by integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.antecedent_family OWNER TO postgres;

--
-- Name: antecedent_family_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.antecedent_family_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.antecedent_family_id_seq OWNER TO postgres;

--
-- Name: antecedent_family_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.antecedent_family_id_seq OWNED BY public.antecedent_family.id;


--
-- Name: antecedent_gyneco; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.antecedent_gyneco (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    gestite integer,
    parite integer,
    avortement integer,
    complications text,
    suivi_gynecologique text,
    depistage_cancer_col text,
    remarque text,
    created_by integer NOT NULL,
    updated_by integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT antecedent_gyneco_avortement_check CHECK ((avortement >= 0)),
    CONSTRAINT antecedent_gyneco_gestite_check CHECK ((gestite >= 0)),
    CONSTRAINT antecedent_gyneco_parite_check CHECK ((parite >= 0))
);


ALTER TABLE public.antecedent_gyneco OWNER TO postgres;

--
-- Name: antecedent_gyneco_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.antecedent_gyneco_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.antecedent_gyneco_id_seq OWNER TO postgres;

--
-- Name: antecedent_gyneco_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.antecedent_gyneco_id_seq OWNED BY public.antecedent_gyneco.id;


--
-- Name: antecedent_medical; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.antecedent_medical (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    diabete boolean DEFAULT false NOT NULL,
    hypertension boolean DEFAULT false NOT NULL,
    cardiopathies boolean DEFAULT false NOT NULL,
    insuffisance_renale boolean DEFAULT false NOT NULL,
    maladies_hepatiques boolean DEFAULT false NOT NULL,
    asthme_bpco boolean DEFAULT false NOT NULL,
    cancers boolean DEFAULT false NOT NULL,
    autres text,
    remarque text,
    created_by integer NOT NULL,
    updated_by integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.antecedent_medical OWNER TO postgres;

--
-- Name: antecedent_medical_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.antecedent_medical_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.antecedent_medical_id_seq OWNER TO postgres;

--
-- Name: antecedent_medical_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.antecedent_medical_id_seq OWNED BY public.antecedent_medical.id;


--
-- Name: antecedent_surgical; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.antecedent_surgical (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    description text,
    date_intervention date,
    remarque text,
    created_by integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.antecedent_surgical OWNER TO postgres;

--
-- Name: antecedent_surgical_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.antecedent_surgical_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.antecedent_surgical_id_seq OWNER TO postgres;

--
-- Name: antecedent_surgical_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.antecedent_surgical_id_seq OWNED BY public.antecedent_surgical.id;


--
-- Name: antecedent_therapeutic; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.antecedent_therapeutic (
    id integer NOT NULL,
    patient_id integer,
    medicaments_chroniques text,
    allergies_medicaments text,
    remarque text,
    created_by integer,
    updated_by integer,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.antecedent_therapeutic OWNER TO postgres;

--
-- Name: antecedent_therapeutic_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.antecedent_therapeutic_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.antecedent_therapeutic_id_seq OWNER TO postgres;

--
-- Name: antecedent_therapeutic_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.antecedent_therapeutic_id_seq OWNED BY public.antecedent_therapeutic.id;


--
-- Name: antecedent_tpe_prep; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.antecedent_tpe_prep (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    tpe_nom_traitement text,
    tpe_date date,
    prep_nom_traitement text,
    prep_date date,
    remarque text,
    created_by integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.antecedent_tpe_prep OWNER TO postgres;

--
-- Name: antecedent_tpe_prep_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.antecedent_tpe_prep_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.antecedent_tpe_prep_id_seq OWNER TO postgres;

--
-- Name: antecedent_tpe_prep_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.antecedent_tpe_prep_id_seq OWNED BY public.antecedent_tpe_prep.id;


--
-- Name: antecedent_transfusion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.antecedent_transfusion (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    date_transfusion date,
    remarque text,
    created_by integer NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.antecedent_transfusion OWNER TO postgres;

--
-- Name: antecedent_transfusion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.antecedent_transfusion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.antecedent_transfusion_id_seq OWNER TO postgres;

--
-- Name: antecedent_transfusion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.antecedent_transfusion_id_seq OWNED BY public.antecedent_transfusion.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    request_id uuid,
    user_id integer,
    user_role public.role_enum,
    patient_id integer,
    module character varying(50),
    action public.action_enum NOT NULL,
    entity_id integer,
    old_data jsonb,
    new_data jsonb,
    ip_address character varying(100),
    user_agent text,
    is_anomaly boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id integer NOT NULL,
    numero character varying(100) NOT NULL,
    name character varying(100) NOT NULL,
    surname character varying(100) NOT NULL,
    birthdate date NOT NULL,
    gender character varying(20),
    birth_address_id integer,
    residence_address_id integer,
    phone character varying(20) NOT NULL,
    hospitalisation character varying(20) NOT NULL,
    status character varying(100) DEFAULT 'standard'::character varying NOT NULL,
    remarks text,
    doctor_id integer,
    created_by integer,
    updated_by integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    user_id integer,
    email character varying(255),
    whatsapp character varying(20),
    CONSTRAINT patients_gender_check CHECK (((gender)::text = ANY ((ARRAY['homme'::character varying, 'femme'::character varying, 'transgenre'::character varying])::text[]))),
    CONSTRAINT patients_hospitalisation_check CHECK (((hospitalisation)::text = ANY ((ARRAY['interne'::character varying, 'externe'::character varying])::text[]))),
    CONSTRAINT patients_status_check CHECK (((status)::text = ANY (ARRAY['standard'::text, 'standard_inactif'::text, 'migrant'::text, 'migrant_inactif'::text, 'decede'::text, 'decede_sida'::text, 'transfere'::text])))
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    nom character varying(50),
    prenom character varying(50),
    email character varying(255),
    password character varying(255) NOT NULL,
    role public.role_enum,
    isactivated boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    must_change_password boolean DEFAULT false,
    username character varying(100),
    expo_push_token character varying(255)
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: audit_logs_details_v; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.audit_logs_details_v AS
 SELECT al.id,
    al.created_at,
    al.module,
    al.action,
    al.user_id,
    al.user_role,
    u.nom AS user_nom,
    u.prenom AS user_prenom,
    u.email AS user_email,
    al.patient_id,
    p.numero AS patient_numero,
    al.ip_address,
    al.user_agent,
    al.request_id,
    al.is_anomaly,
    al.old_data,
    al.new_data
   FROM ((public.audit_logs al
     LEFT JOIN public.users u ON ((u.id = al.user_id)))
     LEFT JOIN public.patients p ON ((p.id = al.patient_id)));


ALTER VIEW public.audit_logs_details_v OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: audit_logs_list_v; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.audit_logs_list_v AS
 SELECT al.id,
    al.created_at,
    al.module,
    al.action,
    al.user_id,
    al.user_role,
    u.nom AS user_nom,
    u.prenom AS user_prenom,
    u.email AS user_email,
    al.patient_id,
    p.numero AS patient_numero,
    al.ip_address,
    al.is_anomaly
   FROM ((public.audit_logs al
     LEFT JOIN public.users u ON ((u.id = al.user_id)))
     LEFT JOIN public.patients p ON ((p.id = al.patient_id)));


ALTER VIEW public.audit_logs_list_v OWNER TO postgres;

--
-- Name: autres_signes_cliniques; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.autres_signes_cliniques (
    id integer NOT NULL,
    signes_cliniques_id integer NOT NULL,
    appareil_id integer NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.autres_signes_cliniques OWNER TO postgres;

--
-- Name: autres_signes_cliniques_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.autres_signes_cliniques_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.autres_signes_cliniques_id_seq OWNER TO postgres;

--
-- Name: autres_signes_cliniques_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.autres_signes_cliniques_id_seq OWNED BY public.autres_signes_cliniques.id;


--
-- Name: autres_signes_fonctionnels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.autres_signes_fonctionnels (
    id integer NOT NULL,
    signes_fonctionnels_id integer NOT NULL,
    appareil_id integer NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.autres_signes_fonctionnels OWNER TO postgres;

--
-- Name: autres_signes_fonctionnels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.autres_signes_fonctionnels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.autres_signes_fonctionnels_id_seq OWNER TO postgres;

--
-- Name: autres_signes_fonctionnels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.autres_signes_fonctionnels_id_seq OWNED BY public.autres_signes_fonctionnels.id;


--
-- Name: bilan_examens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bilan_examens (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    bilan_initial_complet boolean DEFAULT false,
    serologie_vih boolean DEFAULT false,
    bilan_biochimique boolean DEFAULT false,
    serologie_vhb boolean DEFAULT false,
    nfs_complete boolean DEFAULT false,
    charge_virale_vih boolean DEFAULT false,
    cd4_cd8 boolean DEFAULT false,
    bilan_lipidique boolean DEFAULT false,
    serologie_vha boolean DEFAULT false,
    serologie_vhc boolean DEFAULT false,
    serologie_syphilis boolean DEFAULT false,
    serologie_toxoplasmose boolean DEFAULT false,
    serologie_cmv boolean DEFAULT false,
    serologie_leishmaniose boolean DEFAULT false,
    idr_tuberculine boolean DEFAULT false,
    test_genotypage boolean DEFAULT false,
    radio_thorax boolean DEFAULT false,
    observations text,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.bilan_examens OWNER TO postgres;

--
-- Name: bilan_examens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bilan_examens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bilan_examens_id_seq OWNER TO postgres;

--
-- Name: bilan_examens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bilan_examens_id_seq OWNED BY public.bilan_examens.id;


--
-- Name: doctor_conclusions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctor_conclusions (
    id bigint NOT NULL,
    patient_id bigint NOT NULL,
    doctor_id bigint NOT NULL,
    content text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.doctor_conclusions OWNER TO postgres;

--
-- Name: doctor_conclusions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.doctor_conclusions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctor_conclusions_id_seq OWNER TO postgres;

--
-- Name: doctor_conclusions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doctor_conclusions_id_seq OWNED BY public.doctor_conclusions.id;


--
-- Name: emergency_contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emergency_contacts (
    id integer NOT NULL,
    nom character varying(150) NOT NULL,
    telephone character varying(20),
    whatsapp character varying(20),
    email character varying(150),
    description text,
    created_by integer NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.emergency_contacts OWNER TO postgres;

--
-- Name: emergency_contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emergency_contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emergency_contacts_id_seq OWNER TO postgres;

--
-- Name: emergency_contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emergency_contacts_id_seq OWNED BY public.emergency_contacts.id;


--
-- Name: examen_clinique; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.examen_clinique (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    date_examen timestamp without time zone NOT NULL,
    medecin_id integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.examen_clinique OWNER TO postgres;

--
-- Name: examen_clinique_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.examen_clinique_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.examen_clinique_id_seq OWNER TO postgres;

--
-- Name: examen_clinique_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.examen_clinique_id_seq OWNED BY public.examen_clinique.id;


--
-- Name: governorates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.governorates (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE public.governorates OWNER TO postgres;

--
-- Name: governorates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.governorates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.governorates_id_seq OWNER TO postgres;

--
-- Name: governorates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.governorates_id_seq OWNED BY public.governorates.id;


--
-- Name: habitudes_vie; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.habitudes_vie (
    id integer NOT NULL,
    tabagisme boolean DEFAULT false,
    alcoolemie boolean DEFAULT false,
    activite_physique boolean DEFAULT false,
    proteines boolean DEFAULT false,
    proteines_date date,
    creatine boolean DEFAULT false,
    creatine_date date,
    complements_vitaminiques boolean DEFAULT false,
    complements_vitaminiques_type character varying(255),
    complements_vitaminiques_date date,
    multivitamines boolean DEFAULT false,
    multivitamines_type character varying(255),
    multivitamines_date date,
    plantes_medicinales boolean DEFAULT false,
    plantes_medicinales_type character varying(255),
    plantes_medicinales_date date,
    autres_complements boolean DEFAULT false,
    autres_complements_type character varying(255),
    autres_complements_date date,
    drogues_injectables boolean DEFAULT false,
    drogues_injectables_date date,
    cannabis boolean DEFAULT false,
    cannabis_date date,
    cocaine boolean DEFAULT false,
    cocaine_date date,
    crack boolean DEFAULT false,
    crack_date date,
    heroine boolean DEFAULT false,
    heroine_date date,
    ecstasy boolean DEFAULT false,
    ecstasy_date date,
    pregabaline boolean DEFAULT false,
    pregabaline_date date,
    tramadol boolean DEFAULT false,
    tramadol_date date,
    codeine boolean DEFAULT false,
    codeine_date date,
    chicha boolean DEFAULT false,
    cafeine_excessive boolean DEFAULT false,
    created_by integer,
    updated_by integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    patient_id integer
);


ALTER TABLE public.habitudes_vie OWNER TO postgres;

--
-- Name: habitudes_vie_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.habitudes_vie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.habitudes_vie_id_seq OWNER TO postgres;

--
-- Name: habitudes_vie_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.habitudes_vie_id_seq OWNED BY public.habitudes_vie.id;


--
-- Name: social; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.social (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    situation_social public.situation_social_enum,
    niveau_etude public.niveau_etude_enum,
    nombre_enfants integer DEFAULT 0,
    type_ressource public.type_ressource_enum,
    activite_professionnelle public.activite_professionnelle_enum,
    probleme public.probleme_enum[],
    remarque text,
    created_by integer,
    updated_by integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.social OWNER TO postgres;

--
-- Name: vih; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vih (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    mode_contamination character varying(50),
    type_depistage character varying(20),
    circonstance_decouverte character varying(100),
    date_derniere_negative date,
    date_vih_positif date,
    stade_cdc character varying(10),
    created_by integer,
    updated_by integer,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.vih OWNER TO postgres;

--
-- Name: mv_dim_population; Type: MATERIALIZED VIEW; Schema: public; Owner: postgres
--

CREATE MATERIALIZED VIEW public.mv_dim_population AS
 WITH hsh_patients AS (
         SELECT DISTINCT v.patient_id
           FROM (public.vih v
             JOIN public.patients p_1 ON ((p_1.id = v.patient_id)))
          WHERE ((((v.mode_contamination)::text ~~* '%Homosexuel%'::text) OR ((v.mode_contamination)::text ~~* '%Bisexuel%'::text)) AND ((p_1.gender)::text = 'homme'::text))
        ), udi_patients AS (
         SELECT DISTINCT udi_combined.patient_id
           FROM ( SELECT habitudes_vie.patient_id
                   FROM public.habitudes_vie
                  WHERE (habitudes_vie.drogues_injectables = true)
                UNION
                 SELECT vih.patient_id
                   FROM public.vih
                  WHERE ((vih.mode_contamination)::text ~~* '%Toxicomanie IV%'::text)) udi_combined
        ), ps_patients AS (
         SELECT DISTINCT social.patient_id
           FROM public.social
          WHERE (social.activite_professionnelle = 'professionnelle_du_sexe'::public.activite_professionnelle_enum)
        )
 SELECT p.id AS patient_id,
        CASE
            WHEN (hsh.patient_id IS NOT NULL) THEN true
            ELSE false
        END AS is_hsh,
        CASE
            WHEN (udi.patient_id IS NOT NULL) THEN true
            ELSE false
        END AS is_udi,
        CASE
            WHEN (ps.patient_id IS NOT NULL) THEN true
            ELSE false
        END AS is_ps,
        CASE
            WHEN ((p.gender)::text = 'transgenre'::text) THEN true
            ELSE false
        END AS is_transgenre
   FROM (((public.patients p
     LEFT JOIN hsh_patients hsh ON ((hsh.patient_id = p.id)))
     LEFT JOIN udi_patients udi ON ((udi.patient_id = p.id)))
     LEFT JOIN ps_patients ps ON ((ps.patient_id = p.id)))
  WITH NO DATA;


ALTER MATERIALIZED VIEW public.mv_dim_population OWNER TO postgres;

--
-- Name: suivi_therapeutique; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suivi_therapeutique (
    id integer NOT NULL,
    prescription_id integer NOT NULL,
    patient_id integer NOT NULL,
    statut_patient character varying(50) DEFAULT 'actif'::character varying NOT NULL,
    date_prochaine_prise date,
    date_ecart integer DEFAULT 0 NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    alerte_contradiction boolean DEFAULT false,
    CONSTRAINT suivi_therapeutique_date_ecart_check CHECK ((date_ecart >= 0)),
    CONSTRAINT suivi_therapeutique_statut_patient_check CHECK (((statut_patient)::text = ANY (ARRAY[('actif'::character varying)::text, ('en_retard'::character varying)::text, ('perdu_de_vue'::character varying)::text, ('recupere'::character varying)::text])))
);


ALTER TABLE public.suivi_therapeutique OWNER TO postgres;

--
-- Name: mv_dim_statut_patient; Type: MATERIALIZED VIEW; Schema: public; Owner: postgres
--

CREATE MATERIALIZED VIEW public.mv_dim_statut_patient AS
 WITH dernier_suivi AS (
         SELECT DISTINCT ON (suivi_therapeutique.patient_id) suivi_therapeutique.patient_id,
            suivi_therapeutique.statut_patient
           FROM public.suivi_therapeutique
          ORDER BY suivi_therapeutique.patient_id, suivi_therapeutique.updated_at DESC, suivi_therapeutique.id DESC
        )
 SELECT p.id AS patient_id,
        CASE
            WHEN ((p.status)::text = 'decede'::text) THEN 'decede_normale'::text
            WHEN ((p.status)::text = 'decede_sida'::text) THEN 'decede_sida'::text
            WHEN ((p.status)::text = 'transfere'::text) THEN 'transfere'::text
            WHEN ((p.status)::text = ANY ((ARRAY['migrant'::character varying, 'migrant_inactif'::character varying])::text[])) THEN 'migrant'::text
            WHEN ((ds.statut_patient)::text = 'perdu_de_vue'::text) THEN 'perdu_de_vue'::text
            WHEN ((ds.statut_patient)::text = 'recupere'::text) THEN 'recupere'::text
            ELSE NULL::text
        END AS statut
   FROM (public.patients p
     LEFT JOIN dernier_suivi ds ON ((ds.patient_id = p.id)))
  WHERE (((p.status)::text = ANY ((ARRAY['decede'::character varying, 'decede_sida'::character varying, 'transfere'::character varying, 'migrant'::character varying, 'migrant_inactif'::character varying])::text[])) OR ((ds.statut_patient)::text = ANY ((ARRAY['perdu_de_vue'::character varying, 'recupere'::character varying])::text[])))
  WITH NO DATA;


ALTER MATERIALIZED VIEW public.mv_dim_statut_patient OWNER TO postgres;

--
-- Name: resultats_biologiques; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.resultats_biologiques (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    bilan_id integer,
    serologie_vih character varying(20),
    asat numeric,
    alat numeric,
    phosphore numeric,
    calcemie numeric,
    creatinine numeric,
    vhb_ag_hbs character varying(20),
    vhb_ac_hbs character varying(20),
    vhb_ac_hbc character varying(20),
    hemoglobine numeric,
    plaquettes numeric,
    globules_blancs numeric,
    lymphocytes numeric,
    charge_virale_valeur numeric,
    cd4_absolu numeric,
    cd4_pourcent numeric,
    cholesterol_total numeric,
    hdl numeric,
    ldl numeric,
    triglycerides numeric,
    vha_igg character varying(20),
    vhc character varying(20),
    vdrl character varying(20),
    tpha character varying(20),
    toxo_igm character varying(20),
    toxo_igg character varying(20),
    cmv_igm character varying(20),
    cmv_igg character varying(20),
    leishmania_ac character varying(20),
    idr_tuberculine character varying(20),
    radio_resultat character varying(30),
    radio_description text,
    date_serologie_vih date,
    date_bilan_biochimique date,
    date_serologie_vhb date,
    date_nfs_complete date,
    date_charge_virale_vih date,
    date_cd4_cd8 date,
    date_bilan_lipidique date,
    date_serologie_vha date,
    date_serologie_vhc date,
    date_serologie_syphilis date,
    date_serologie_toxoplasmose date,
    date_serologie_cmv date,
    date_serologie_leishmaniose date,
    date_idr_tuberculine date,
    date_radio_thorax date,
    observations text,
    date_resultat date DEFAULT CURRENT_DATE,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now(),
    genotypage_file_url text,
    date_test_genotypage date
);


ALTER TABLE public.resultats_biologiques OWNER TO postgres;

--
-- Name: mv_dim_statut_viral; Type: MATERIALIZED VIEW; Schema: public; Owner: postgres
--

CREATE MATERIALIZED VIEW public.mv_dim_statut_viral AS
 WITH derniere_cv AS (
         SELECT DISTINCT ON (resultats_biologiques.patient_id) resultats_biologiques.patient_id,
            resultats_biologiques.charge_virale_valeur,
            resultats_biologiques.date_charge_virale_vih
           FROM public.resultats_biologiques
          WHERE ((resultats_biologiques.charge_virale_valeur IS NOT NULL) AND (resultats_biologiques.date_charge_virale_vih IS NOT NULL))
          ORDER BY resultats_biologiques.patient_id, resultats_biologiques.date_charge_virale_vih DESC
        )
 SELECT patient_id,
    charge_virale_valeur,
        CASE
            WHEN (charge_virale_valeur < (50)::numeric) THEN 'lt50'::text
            WHEN (charge_virale_valeur < (1000)::numeric) THEN 'lt1000'::text
            ELSE 'gt1000'::text
        END AS statut_viral
   FROM derniere_cv
  WITH NO DATA;


ALTER MATERIALIZED VIEW public.mv_dim_statut_viral OWNER TO postgres;

--
-- Name: prescription_medicale; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescription_medicale (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    medecin_id integer,
    posologie character varying(255),
    date date DEFAULT CURRENT_DATE NOT NULL,
    periode integer NOT NULL,
    periode_modifiee integer,
    statut character varying(20) DEFAULT 'envoyee'::character varying NOT NULL,
    date_delivrance date,
    remarque text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT prescription_medicale_check CHECK (((periode_modifiee > 0) AND (periode_modifiee <= periode))),
    CONSTRAINT prescription_medicale_periode_check CHECK ((periode > 0)),
    CONSTRAINT prescription_medicale_statut_check CHECK (((statut)::text = ANY ((ARRAY['envoyee'::character varying, 'delivree'::character varying, 'modifie'::character varying, 'non_validee'::character varying])::text[])))
);


ALTER TABLE public.prescription_medicale OWNER TO postgres;

--
-- Name: v_dim_patient; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_dim_patient AS
 SELECT id AS patient_id,
    gender,
    birthdate
   FROM public.patients;


ALTER VIEW public.v_dim_patient OWNER TO postgres;

--
-- Name: v_dim_age; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_dim_age AS
 SELECT patient_id,
        CASE
            WHEN (age_annees < 1) THEN '<1an'::text
            WHEN (age_annees < 5) THEN '1-4ans'::text
            WHEN (age_annees < 10) THEN '5-9ans'::text
            WHEN (age_annees < 15) THEN '10-14ans'::text
            WHEN (age_annees < 20) THEN '15-19ans'::text
            WHEN (age_annees < 25) THEN '20-24ans'::text
            WHEN (age_annees < 50) THEN '25-49ans'::text
            ELSE '>50ans'::text
        END AS tranche_8,
        CASE
            WHEN (age_annees < 5) THEN '<5ans'::text
            WHEN (age_annees < 15) THEN '5-14ans'::text
            ELSE '>15ans'::text
        END AS tranche_3
   FROM ( SELECT v_dim_patient.patient_id,
            (EXTRACT(year FROM age(now(), (v_dim_patient.birthdate)::timestamp with time zone)))::integer AS age_annees
           FROM public.v_dim_patient) sub;


ALTER VIEW public.v_dim_age OWNER TO postgres;

--
-- Name: mv_fait_file_active; Type: MATERIALIZED VIEW; Schema: public; Owner: postgres
--

CREATE MATERIALIZED VIEW public.mv_fait_file_active AS
 WITH premiere_prescription AS (
         SELECT prescription_medicale.patient_id,
            min(prescription_medicale.date) AS date_debut_arv
           FROM public.prescription_medicale
          GROUP BY prescription_medicale.patient_id
        ), cv_controle AS (
         SELECT DISTINCT ON (rb.patient_id) rb.patient_id,
            rb.charge_virale_valeur AS cv_controle_valeur,
            rb.date_charge_virale_vih
           FROM (public.resultats_biologiques rb
             JOIN premiere_prescription pp ON ((pp.patient_id = rb.patient_id)))
          WHERE ((rb.charge_virale_valeur IS NOT NULL) AND (rb.date_charge_virale_vih IS NOT NULL) AND (pp.date_debut_arv <= (now() - '6 mons'::interval)) AND (rb.date_charge_virale_vih >= (pp.date_debut_arv + '6 mons'::interval)))
          ORDER BY rb.patient_id, rb.date_charge_virale_vih DESC
        )
 SELECT p.patient_id,
    p.gender,
    (EXTRACT(year FROM now()))::integer AS annee,
    a.tranche_8,
    a.tranche_3,
    pop.is_hsh,
    pop.is_udi,
    pop.is_ps,
    pop.is_transgenre,
    COALESCE(sv.statut_viral, 'sans_mesure'::text) AS statut_viral,
        CASE
            WHEN (cvc.patient_id IS NOT NULL) THEN true
            ELSE false
        END AS a_cv_controle,
        CASE
            WHEN (sv.statut_viral = ANY (ARRAY['lt50'::text, 'lt1000'::text])) THEN true
            ELSE false
        END AS est_supprime_lt1000,
        CASE
            WHEN (sv.statut_viral = 'lt50'::text) THEN true
            ELSE false
        END AS est_supprime_lt50,
    sp.statut AS statut_patient
   FROM (((((public.v_dim_patient p
     JOIN public.v_dim_age a ON ((a.patient_id = p.patient_id)))
     LEFT JOIN public.mv_dim_population pop ON ((pop.patient_id = p.patient_id)))
     LEFT JOIN public.mv_dim_statut_viral sv ON ((sv.patient_id = p.patient_id)))
     LEFT JOIN public.mv_dim_statut_patient sp ON ((sp.patient_id = p.patient_id)))
     LEFT JOIN cv_controle cvc ON ((cvc.patient_id = p.patient_id)))
  WITH NO DATA;


ALTER MATERIALIZED VIEW public.mv_fait_file_active OWNER TO postgres;

--
-- Name: mv_fait_nouveaux_malades; Type: MATERIALIZED VIEW; Schema: public; Owner: postgres
--

CREATE MATERIALIZED VIEW public.mv_fait_nouveaux_malades AS
 WITH vih_unique AS (
         SELECT DISTINCT ON (vih.patient_id) vih.patient_id,
            vih.date_vih_positif
           FROM public.vih
          WHERE (vih.date_vih_positif IS NOT NULL)
          ORDER BY vih.patient_id, vih.date_vih_positif
        ), age_diag AS (
         SELECT p.patient_id,
            p.gender,
            vu.date_vih_positif,
            (EXTRACT(year FROM age((vu.date_vih_positif)::timestamp with time zone, (p.birthdate)::timestamp with time zone)))::integer AS age_annees
           FROM (public.v_dim_patient p
             JOIN vih_unique vu ON ((vu.patient_id = p.patient_id)))
        ), premier_cd4 AS (
         SELECT DISTINCT ON (rb.patient_id) rb.patient_id,
            rb.cd4_absolu
           FROM (public.resultats_biologiques rb
             JOIN vih_unique v ON ((v.patient_id = rb.patient_id)))
          WHERE ((rb.cd4_absolu IS NOT NULL) AND (rb.date_resultat IS NOT NULL) AND (rb.date_resultat >= v.date_vih_positif))
          ORDER BY rb.patient_id, rb.date_resultat
        )
 SELECT ad.patient_id,
    ad.gender,
    (EXTRACT(year FROM ad.date_vih_positif))::integer AS annee,
    (EXTRACT(quarter FROM ad.date_vih_positif))::integer AS trimestre,
        CASE
            WHEN (ad.age_annees < 1) THEN '<1an'::text
            WHEN (ad.age_annees < 5) THEN '1-4ans'::text
            WHEN (ad.age_annees < 10) THEN '5-9ans'::text
            WHEN (ad.age_annees < 15) THEN '10-14ans'::text
            WHEN (ad.age_annees < 20) THEN '15-19ans'::text
            WHEN (ad.age_annees < 25) THEN '20-24ans'::text
            WHEN (ad.age_annees < 50) THEN '25-49ans'::text
            ELSE '>50ans'::text
        END AS tranche_8,
        CASE
            WHEN (ad.age_annees < 25) THEN '<25ans'::text
            ELSE '>=25ans'::text
        END AS tranche_2,
    pop.is_hsh,
    pop.is_udi,
    pop.is_ps,
    pop.is_transgenre,
        CASE
            WHEN (pc.patient_id IS NULL) THEN 'sans_mesure'::text
            WHEN (pc.cd4_absolu < (200)::numeric) THEN 'lt200'::text
            WHEN (pc.cd4_absolu <= (350)::numeric) THEN '200_350'::text
            ELSE 'gt350'::text
        END AS seuil_cd4
   FROM ((age_diag ad
     LEFT JOIN public.mv_dim_population pop ON ((pop.patient_id = ad.patient_id)))
     LEFT JOIN premier_cd4 pc ON ((pc.patient_id = ad.patient_id)))
  WITH NO DATA;


ALTER MATERIALIZED VIEW public.mv_fait_nouveaux_malades OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    suivi_id integer,
    rdv_id integer,
    prescription_id integer,
    type character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    CONSTRAINT notifications_type_check CHECK (((type)::text = ANY ((ARRAY['delivrance'::character varying, 'en_retard'::character varying, 'perdu_de_vue'::character varying, 'recupere'::character varying, 'alerte'::character varying, 'prescription_non_validee'::character varying, 'rdv_manque'::character varying, 'rdv_proche'::character varying])::text[])))
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- Name: observations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.observations (
    id integer NOT NULL,
    examen_clinique_id integer NOT NULL,
    remarque text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.observations OWNER TO postgres;

--
-- Name: observations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.observations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.observations_id_seq OWNER TO postgres;

--
-- Name: observations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.observations_id_seq OWNED BY public.observations.id;


--
-- Name: password_resets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.password_resets (
    id integer NOT NULL,
    user_id integer,
    token text NOT NULL,
    expires_at timestamp without time zone NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.password_resets OWNER TO postgres;

--
-- Name: password_resets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.password_resets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.password_resets_id_seq OWNER TO postgres;

--
-- Name: password_resets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.password_resets_id_seq OWNED BY public.password_resets.id;


--
-- Name: patients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patients_id_seq OWNER TO postgres;

--
-- Name: patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patients_id_seq OWNED BY public.patients.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.permissions (
    id uuid,
    patient_id integer,
    medecin_id integer,
    can_view_viral_load boolean DEFAULT false,
    can_view_cd4 boolean DEFAULT false,
    granted_at timestamp without time zone,
    expires_at timestamp without time zone
);


ALTER TABLE public.permissions OWNER TO postgres;

--
-- Name: postal_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.postal_codes (
    id integer NOT NULL,
    governorate_id integer NOT NULL,
    code character(4) NOT NULL,
    place_name character varying(120) NOT NULL,
    CONSTRAINT postal_codes_code_check CHECK ((code ~ '^[0-9]{4}$'::text))
);


ALTER TABLE public.postal_codes OWNER TO postgres;

--
-- Name: postal_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.postal_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.postal_codes_id_seq OWNER TO postgres;

--
-- Name: postal_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.postal_codes_id_seq OWNED BY public.postal_codes.id;


--
-- Name: prescription_lignes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescription_lignes (
    id integer NOT NULL,
    prescription_id integer NOT NULL,
    medicament_id integer,
    medicament_nom_snapshot character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.prescription_lignes OWNER TO postgres;

--
-- Name: prescription_lignes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prescription_lignes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prescription_lignes_id_seq OWNER TO postgres;

--
-- Name: prescription_lignes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prescription_lignes_id_seq OWNED BY public.prescription_lignes.id;


--
-- Name: prescription_medicale_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prescription_medicale_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prescription_medicale_id_seq OWNER TO postgres;

--
-- Name: prescription_medicale_id_seq1; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prescription_medicale_id_seq1
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prescription_medicale_id_seq1 OWNER TO postgres;

--
-- Name: prescription_medicale_id_seq1; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prescription_medicale_id_seq1 OWNED BY public.prescription_medicale.id;


--
-- Name: ref_appareil_fonctionnel; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ref_appareil_fonctionnel (
    id integer NOT NULL,
    libelle character varying(100) NOT NULL,
    ordre integer NOT NULL
);


ALTER TABLE public.ref_appareil_fonctionnel OWNER TO postgres;

--
-- Name: ref_appareil_fonctionnel_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ref_appareil_fonctionnel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ref_appareil_fonctionnel_id_seq OWNER TO postgres;

--
-- Name: ref_appareil_fonctionnel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ref_appareil_fonctionnel_id_seq OWNED BY public.ref_appareil_fonctionnel.id;


--
-- Name: rendezvous_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rendezvous_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rendezvous_id_seq OWNER TO postgres;

--
-- Name: rendezvous; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rendezvous (
    id integer DEFAULT nextval('public.rendezvous_id_seq'::regclass) NOT NULL,
    patient_id integer NOT NULL,
    date date NOT NULL,
    heure time without time zone,
    type character varying(255) NOT NULL,
    commentaire text,
    statut character varying(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rendezvous OWNER TO postgres;

--
-- Name: resultats_biologiques_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.resultats_biologiques_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.resultats_biologiques_id_seq OWNER TO postgres;

--
-- Name: resultats_biologiques_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.resultats_biologiques_id_seq OWNED BY public.resultats_biologiques.id;


--
-- Name: signes_cliniques; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.signes_cliniques (
    id integer NOT NULL,
    examen_clinique_id integer NOT NULL,
    poids numeric(5,2),
    taille numeric(5,2),
    imc numeric(5,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.signes_cliniques OWNER TO postgres;

--
-- Name: signes_cliniques_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.signes_cliniques_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.signes_cliniques_id_seq OWNER TO postgres;

--
-- Name: signes_cliniques_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.signes_cliniques_id_seq OWNED BY public.signes_cliniques.id;


--
-- Name: signes_fonctionnels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.signes_fonctionnels (
    id integer NOT NULL,
    examen_clinique_id integer NOT NULL,
    fievre boolean DEFAULT false,
    toux boolean DEFAULT false,
    dyspnee boolean DEFAULT false,
    sueurs_nocturnes boolean DEFAULT false,
    cephalee boolean DEFAULT false,
    rhinorrhee boolean DEFAULT false,
    troubles_visuels boolean DEFAULT false,
    diarrhee boolean DEFAULT false,
    douleurs_abdomen boolean DEFAULT false,
    nausees boolean DEFAULT false,
    dysphagie boolean DEFAULT false,
    prurit boolean DEFAULT false,
    paresthesie boolean DEFAULT false,
    myalgie boolean DEFAULT false,
    arthralgie boolean DEFAULT false,
    anorexie boolean DEFAULT false,
    insomnie boolean DEFAULT false,
    troubles_humeur boolean DEFAULT false,
    asthenie boolean DEFAULT false,
    crampes boolean DEFAULT false,
    troubles_libido boolean DEFAULT false,
    ras boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now(),
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.signes_fonctionnels OWNER TO postgres;

--
-- Name: signes_fonctionnels_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.signes_fonctionnels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.signes_fonctionnels_id_seq OWNER TO postgres;

--
-- Name: signes_fonctionnels_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.signes_fonctionnels_id_seq OWNED BY public.signes_fonctionnels.id;


--
-- Name: social_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.social_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_id_seq OWNER TO postgres;

--
-- Name: social_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.social_id_seq OWNED BY public.social.id;


--
-- Name: stock_medicaments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_medicaments (
    id integer NOT NULL,
    code character varying(30) NOT NULL,
    composition character varying(255) NOT NULL,
    quantite integer DEFAULT 0 NOT NULL,
    created_by integer,
    updated_by integer,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    dosage character varying(100) DEFAULT NULL::character varying,
    CONSTRAINT stock_medicaments_quantite_check CHECK ((quantite >= 0))
);


ALTER TABLE public.stock_medicaments OWNER TO postgres;

--
-- Name: stock_medicaments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_medicaments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_medicaments_id_seq OWNER TO postgres;

--
-- Name: stock_medicaments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_medicaments_id_seq OWNED BY public.stock_medicaments.id;


--
-- Name: suivi_therapeutique_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.suivi_therapeutique_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.suivi_therapeutique_id_seq OWNER TO postgres;

--
-- Name: suivi_therapeutique_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.suivi_therapeutique_id_seq OWNED BY public.suivi_therapeutique.id;


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: v_dim_temps; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.v_dim_temps AS
 SELECT DISTINCT (EXTRACT(year FROM date_vih_positif))::integer AS annee,
    (EXTRACT(quarter FROM date_vih_positif))::integer AS trimestre,
    (EXTRACT(month FROM date_vih_positif))::integer AS mois
   FROM public.vih
  WHERE (date_vih_positif IS NOT NULL);


ALTER VIEW public.v_dim_temps OWNER TO postgres;

--
-- Name: vih_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vih_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vih_id_seq OWNER TO postgres;

--
-- Name: vih_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vih_id_seq OWNED BY public.vih.id;


--
-- Name: vue_periodes_arv; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vue_periodes_arv AS
 WITH prescriptions_ordonnees AS (
         SELECT pm.patient_id,
            pm.date AS date_prescription,
            pm.id AS prescription_id,
            string_agg((COALESCE(sm.composition, pl.medicament_nom_snapshot))::text, ' + '::text ORDER BY pl.id) AS nom_medicament,
            string_agg((COALESCE(sm.code, pl.medicament_nom_snapshot))::text, ' + '::text ORDER BY pl.id) AS code_medicament,
            string_agg((pl.medicament_id)::text, ','::text ORDER BY pl.medicament_id) AS combo_ids,
            lag(string_agg((pl.medicament_id)::text, ','::text ORDER BY pl.medicament_id)) OVER (PARTITION BY pm.patient_id ORDER BY pm.date, pm.id) AS combo_precedent
           FROM ((public.prescription_medicale pm
             JOIN public.prescription_lignes pl ON ((pl.prescription_id = pm.id)))
             LEFT JOIN public.stock_medicaments sm ON ((sm.id = pl.medicament_id)))
          GROUP BY pm.patient_id, pm.date, pm.id
        ), changements_reels AS (
         SELECT prescriptions_ordonnees.patient_id,
            prescriptions_ordonnees.date_prescription,
            prescriptions_ordonnees.prescription_id,
            prescriptions_ordonnees.nom_medicament,
            prescriptions_ordonnees.code_medicament,
            prescriptions_ordonnees.combo_ids,
            prescriptions_ordonnees.combo_precedent
           FROM prescriptions_ordonnees
          WHERE ((prescriptions_ordonnees.combo_precedent IS NULL) OR (prescriptions_ordonnees.combo_ids <> prescriptions_ordonnees.combo_precedent))
        )
 SELECT patient_id,
    prescription_id,
    nom_medicament,
    code_medicament,
    date_prescription AS date_debut,
    (lead(date_prescription) OVER (PARTITION BY patient_id ORDER BY date_prescription) - '1 day'::interval) AS date_fin
   FROM changements_reels;


ALTER VIEW public.vue_periodes_arv OWNER TO postgres;

--
-- Name: vue_points_cd4; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vue_points_cd4 AS
 SELECT rb.id AS resultat_id,
    rb.patient_id,
    rb.bilan_id,
    rb.date_cd4_cd8 AS date_point,
    rb.cd4_absolu,
    rb.cd4_pourcent,
        CASE
            WHEN (be.bilan_initial_complet = true) THEN 'Initial'::text
            ELSE 'ContrÃ´le'::text
        END AS type_bilan,
    COALESCE(arv.nom_medicament, 'Pas encore de traitement'::text) AS traitement,
    COALESCE(arv.code_medicament, 'N/A'::text) AS traitement_code,
    arv.date_debut AS traitement_date_debut,
    arv.date_fin AS traitement_date_fin
   FROM ((public.resultats_biologiques rb
     LEFT JOIN public.bilan_examens be ON ((be.id = rb.bilan_id)))
     LEFT JOIN public.vue_periodes_arv arv ON (((arv.patient_id = rb.patient_id) AND (rb.date_cd4_cd8 >= arv.date_debut) AND ((arv.date_fin IS NULL) OR (rb.date_cd4_cd8 <= arv.date_fin)))))
  WHERE ((rb.date_cd4_cd8 IS NOT NULL) AND (rb.cd4_absolu IS NOT NULL))
  ORDER BY rb.patient_id, rb.date_cd4_cd8;


ALTER VIEW public.vue_points_cd4 OWNER TO postgres;

--
-- Name: vue_points_cv; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vue_points_cv AS
 SELECT rb.id AS resultat_id,
    rb.patient_id,
    rb.bilan_id,
    rb.date_charge_virale_vih AS date_point,
    rb.charge_virale_valeur,
        CASE
            WHEN (be.bilan_initial_complet = true) THEN 'Initial'::text
            ELSE 'ContrÃ´le'::text
        END AS type_bilan,
    COALESCE(arv.nom_medicament, 'Pas encore de traitement'::text) AS traitement,
    COALESCE(arv.code_medicament, 'N/A'::text) AS traitement_code,
    arv.date_debut AS traitement_date_debut,
    arv.date_fin AS traitement_date_fin
   FROM ((public.resultats_biologiques rb
     LEFT JOIN public.bilan_examens be ON ((be.id = rb.bilan_id)))
     LEFT JOIN public.vue_periodes_arv arv ON (((arv.patient_id = rb.patient_id) AND (rb.date_charge_virale_vih >= arv.date_debut) AND ((arv.date_fin IS NULL) OR (rb.date_charge_virale_vih <= arv.date_fin)))))
  WHERE ((rb.date_charge_virale_vih IS NOT NULL) AND (rb.charge_virale_valeur IS NOT NULL))
  ORDER BY rb.patient_id, rb.date_charge_virale_vih;


ALTER VIEW public.vue_points_cv OWNER TO postgres;

--
-- Name: vue_suivi_patient; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.vue_suivi_patient AS
 SELECT rb.id,
    rb.patient_id,
    rb.bilan_id,
    rb.date_cd4_cd8 AS date_cd4,
    rb.date_charge_virale_vih AS date_cv,
    rb.date_bilan_biochimique,
    rb.date_nfs_complete,
    rb.date_bilan_lipidique,
    rb.date_serologie_vhb,
    rb.date_serologie_vhc,
    rb.date_serologie_vha,
    rb.date_serologie_toxoplasmose,
    rb.date_serologie_cmv,
    COALESCE(rb.date_cd4_cd8, rb.date_charge_virale_vih) AS date_tri,
    rb.cd4_absolu,
    rb.cd4_pourcent,
    rb.charge_virale_valeur,
    rb.plaquettes,
    rb.globules_blancs,
    rb.lymphocytes,
    rb.asat,
    rb.alat,
    rb.creatinine,
    rb.phosphore,
    rb.calcemie,
    rb.cholesterol_total,
    rb.hdl,
    rb.ldl,
    rb.triglycerides,
    rb.vhb_ag_hbs,
    rb.vhb_ac_hbs,
    rb.vhb_ac_hbc,
    rb.vhc,
    rb.vha_igg,
    rb.toxo_igg,
    rb.toxo_igm,
    rb.cmv_igg,
    rb.cmv_igm,
    rb.vdrl,
    rb.tpha,
    rb.leishmania_ac,
    rb.idr_tuberculine,
        CASE
            WHEN (be.bilan_initial_complet = true) THEN 'Initial'::text
            ELSE 'ContrÃ´le'::text
        END AS type_bilan,
    COALESCE(arv.nom_medicament, 'Pas encore de traitement'::text) AS traitement,
    COALESCE(arv.code_medicament, 'N/A'::text) AS traitement_code,
    arv.date_debut AS traitement_date_debut,
    arv.date_fin AS traitement_date_fin,
    rb.observations
   FROM ((public.resultats_biologiques rb
     LEFT JOIN public.bilan_examens be ON ((be.id = rb.bilan_id)))
     LEFT JOIN public.vue_periodes_arv arv ON (((arv.patient_id = rb.patient_id) AND (COALESCE(rb.date_cd4_cd8, rb.date_charge_virale_vih) >= arv.date_debut) AND ((arv.date_fin IS NULL) OR (COALESCE(rb.date_cd4_cd8, rb.date_charge_virale_vih) <= arv.date_fin)))))
  ORDER BY COALESCE(rb.date_cd4_cd8, rb.date_charge_virale_vih) DESC;


ALTER VIEW public.vue_suivi_patient OWNER TO postgres;

--
-- Name: addresses id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses ALTER COLUMN id SET DEFAULT nextval('public.addresses_id_seq'::regclass);


--
-- Name: antecedent_family id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_family ALTER COLUMN id SET DEFAULT nextval('public.antecedent_family_id_seq'::regclass);


--
-- Name: antecedent_gyneco id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_gyneco ALTER COLUMN id SET DEFAULT nextval('public.antecedent_gyneco_id_seq'::regclass);


--
-- Name: antecedent_medical id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_medical ALTER COLUMN id SET DEFAULT nextval('public.antecedent_medical_id_seq'::regclass);


--
-- Name: antecedent_surgical id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_surgical ALTER COLUMN id SET DEFAULT nextval('public.antecedent_surgical_id_seq'::regclass);


--
-- Name: antecedent_therapeutic id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_therapeutic ALTER COLUMN id SET DEFAULT nextval('public.antecedent_therapeutic_id_seq'::regclass);


--
-- Name: antecedent_tpe_prep id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_tpe_prep ALTER COLUMN id SET DEFAULT nextval('public.antecedent_tpe_prep_id_seq'::regclass);


--
-- Name: antecedent_transfusion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_transfusion ALTER COLUMN id SET DEFAULT nextval('public.antecedent_transfusion_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: autres_signes_cliniques id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autres_signes_cliniques ALTER COLUMN id SET DEFAULT nextval('public.autres_signes_cliniques_id_seq'::regclass);


--
-- Name: autres_signes_fonctionnels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autres_signes_fonctionnels ALTER COLUMN id SET DEFAULT nextval('public.autres_signes_fonctionnels_id_seq'::regclass);


--
-- Name: bilan_examens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bilan_examens ALTER COLUMN id SET DEFAULT nextval('public.bilan_examens_id_seq'::regclass);


--
-- Name: doctor_conclusions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_conclusions ALTER COLUMN id SET DEFAULT nextval('public.doctor_conclusions_id_seq'::regclass);


--
-- Name: emergency_contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_contacts ALTER COLUMN id SET DEFAULT nextval('public.emergency_contacts_id_seq'::regclass);


--
-- Name: examen_clinique id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examen_clinique ALTER COLUMN id SET DEFAULT nextval('public.examen_clinique_id_seq'::regclass);


--
-- Name: governorates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.governorates ALTER COLUMN id SET DEFAULT nextval('public.governorates_id_seq'::regclass);


--
-- Name: habitudes_vie id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habitudes_vie ALTER COLUMN id SET DEFAULT nextval('public.habitudes_vie_id_seq'::regclass);


--
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- Name: observations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observations ALTER COLUMN id SET DEFAULT nextval('public.observations_id_seq'::regclass);


--
-- Name: password_resets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_resets ALTER COLUMN id SET DEFAULT nextval('public.password_resets_id_seq'::regclass);


--
-- Name: patients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients ALTER COLUMN id SET DEFAULT nextval('public.patients_id_seq'::regclass);


--
-- Name: postal_codes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postal_codes ALTER COLUMN id SET DEFAULT nextval('public.postal_codes_id_seq'::regclass);


--
-- Name: prescription_lignes id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescription_lignes ALTER COLUMN id SET DEFAULT nextval('public.prescription_lignes_id_seq'::regclass);


--
-- Name: prescription_medicale id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescription_medicale ALTER COLUMN id SET DEFAULT nextval('public.prescription_medicale_id_seq1'::regclass);


--
-- Name: ref_appareil_fonctionnel id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ref_appareil_fonctionnel ALTER COLUMN id SET DEFAULT nextval('public.ref_appareil_fonctionnel_id_seq'::regclass);


--
-- Name: resultats_biologiques id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultats_biologiques ALTER COLUMN id SET DEFAULT nextval('public.resultats_biologiques_id_seq'::regclass);


--
-- Name: signes_cliniques id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signes_cliniques ALTER COLUMN id SET DEFAULT nextval('public.signes_cliniques_id_seq'::regclass);


--
-- Name: signes_fonctionnels id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signes_fonctionnels ALTER COLUMN id SET DEFAULT nextval('public.signes_fonctionnels_id_seq'::regclass);


--
-- Name: social id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social ALTER COLUMN id SET DEFAULT nextval('public.social_id_seq'::regclass);


--
-- Name: stock_medicaments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_medicaments ALTER COLUMN id SET DEFAULT nextval('public.stock_medicaments_id_seq'::regclass);


--
-- Name: suivi_therapeutique id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suivi_therapeutique ALTER COLUMN id SET DEFAULT nextval('public.suivi_therapeutique_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: vih id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vih ALTER COLUMN id SET DEFAULT nextval('public.vih_id_seq'::regclass);


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: antecedent_family antecedent_family_patient_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_family
    ADD CONSTRAINT antecedent_family_patient_id_key UNIQUE (patient_id);


--
-- Name: antecedent_family antecedent_family_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_family
    ADD CONSTRAINT antecedent_family_pkey PRIMARY KEY (id);


--
-- Name: antecedent_gyneco antecedent_gyneco_patient_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_gyneco
    ADD CONSTRAINT antecedent_gyneco_patient_id_key UNIQUE (patient_id);


--
-- Name: antecedent_gyneco antecedent_gyneco_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_gyneco
    ADD CONSTRAINT antecedent_gyneco_pkey PRIMARY KEY (id);


--
-- Name: antecedent_medical antecedent_medical_patient_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_medical
    ADD CONSTRAINT antecedent_medical_patient_id_key UNIQUE (patient_id);


--
-- Name: antecedent_medical antecedent_medical_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_medical
    ADD CONSTRAINT antecedent_medical_pkey PRIMARY KEY (id);


--
-- Name: antecedent_surgical antecedent_surgical_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_surgical
    ADD CONSTRAINT antecedent_surgical_pkey PRIMARY KEY (id);


--
-- Name: antecedent_therapeutic antecedent_therapeutic_patient_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_therapeutic
    ADD CONSTRAINT antecedent_therapeutic_patient_id_key UNIQUE (patient_id);


--
-- Name: antecedent_therapeutic antecedent_therapeutic_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_therapeutic
    ADD CONSTRAINT antecedent_therapeutic_pkey PRIMARY KEY (id);


--
-- Name: antecedent_tpe_prep antecedent_tpe_prep_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_tpe_prep
    ADD CONSTRAINT antecedent_tpe_prep_pkey PRIMARY KEY (id);


--
-- Name: antecedent_transfusion antecedent_transfusion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_transfusion
    ADD CONSTRAINT antecedent_transfusion_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: autres_signes_cliniques autres_signes_cliniques_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autres_signes_cliniques
    ADD CONSTRAINT autres_signes_cliniques_pkey PRIMARY KEY (id);


--
-- Name: autres_signes_fonctionnels autres_signes_fonctionnels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autres_signes_fonctionnels
    ADD CONSTRAINT autres_signes_fonctionnels_pkey PRIMARY KEY (id);


--
-- Name: bilan_examens bilan_examens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bilan_examens
    ADD CONSTRAINT bilan_examens_pkey PRIMARY KEY (id);


--
-- Name: doctor_conclusions doctor_conclusions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_conclusions
    ADD CONSTRAINT doctor_conclusions_pkey PRIMARY KEY (id);


--
-- Name: emergency_contacts emergency_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_contacts
    ADD CONSTRAINT emergency_contacts_pkey PRIMARY KEY (id);


--
-- Name: examen_clinique examen_clinique_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examen_clinique
    ADD CONSTRAINT examen_clinique_pkey PRIMARY KEY (id);


--
-- Name: governorates governorates_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.governorates
    ADD CONSTRAINT governorates_name_key UNIQUE (name);


--
-- Name: governorates governorates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.governorates
    ADD CONSTRAINT governorates_pkey PRIMARY KEY (id);


--
-- Name: habitudes_vie habitudes_vie_patient_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habitudes_vie
    ADD CONSTRAINT habitudes_vie_patient_id_key UNIQUE (patient_id);


--
-- Name: habitudes_vie habitudes_vie_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habitudes_vie
    ADD CONSTRAINT habitudes_vie_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: observations observations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT observations_pkey PRIMARY KEY (id);


--
-- Name: password_resets password_resets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_resets
    ADD CONSTRAINT password_resets_pkey PRIMARY KEY (id);


--
-- Name: patients patients_numero_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_numero_key UNIQUE (numero);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: patients patients_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_user_id_key UNIQUE (user_id);


--
-- Name: permissions permissions_patient_medecin_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_patient_medecin_unique UNIQUE (patient_id, medecin_id);


--
-- Name: postal_codes postal_codes_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postal_codes
    ADD CONSTRAINT postal_codes_code_key UNIQUE (code);


--
-- Name: postal_codes postal_codes_code_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postal_codes
    ADD CONSTRAINT postal_codes_code_unique UNIQUE (code);


--
-- Name: postal_codes postal_codes_governorate_place_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postal_codes
    ADD CONSTRAINT postal_codes_governorate_place_unique UNIQUE (governorate_id, place_name);


--
-- Name: postal_codes postal_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postal_codes
    ADD CONSTRAINT postal_codes_pkey PRIMARY KEY (id);


--
-- Name: prescription_lignes prescription_lignes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescription_lignes
    ADD CONSTRAINT prescription_lignes_pkey PRIMARY KEY (id);


--
-- Name: prescription_medicale prescription_medicale_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescription_medicale
    ADD CONSTRAINT prescription_medicale_pkey PRIMARY KEY (id);


--
-- Name: ref_appareil_fonctionnel ref_appareil_fonctionnel_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ref_appareil_fonctionnel
    ADD CONSTRAINT ref_appareil_fonctionnel_pkey PRIMARY KEY (id);


--
-- Name: rendezvous rendezvous_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rendezvous
    ADD CONSTRAINT rendezvous_pkey PRIMARY KEY (id);


--
-- Name: resultats_biologiques resultats_biologiques_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.resultats_biologiques
    ADD CONSTRAINT resultats_biologiques_pkey PRIMARY KEY (id);


--
-- Name: signes_cliniques signes_cliniques_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signes_cliniques
    ADD CONSTRAINT signes_cliniques_pkey PRIMARY KEY (id);


--
-- Name: signes_fonctionnels signes_fonctionnels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signes_fonctionnels
    ADD CONSTRAINT signes_fonctionnels_pkey PRIMARY KEY (id);


--
-- Name: social social_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social
    ADD CONSTRAINT social_pkey PRIMARY KEY (id);


--
-- Name: stock_medicaments stock_medicaments_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_medicaments
    ADD CONSTRAINT stock_medicaments_code_key UNIQUE (code);


--
-- Name: stock_medicaments stock_medicaments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_medicaments
    ADD CONSTRAINT stock_medicaments_pkey PRIMARY KEY (id);


--
-- Name: suivi_therapeutique suivi_therapeutique_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suivi_therapeutique
    ADD CONSTRAINT suivi_therapeutique_pkey PRIMARY KEY (id);


--
-- Name: suivi_therapeutique suivi_therapeutique_prescription_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suivi_therapeutique
    ADD CONSTRAINT suivi_therapeutique_prescription_id_key UNIQUE (prescription_id);


--
-- Name: social unique_patient_social; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social
    ADD CONSTRAINT unique_patient_social UNIQUE (patient_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: vih vih_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vih
    ADD CONSTRAINT vih_pkey PRIMARY KEY (id);


--
-- Name: antecedent_family_patient_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX antecedent_family_patient_id_idx ON public.antecedent_family USING btree (patient_id);


--
-- Name: antecedent_medical_patient_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX antecedent_medical_patient_id_idx ON public.antecedent_medical USING btree (patient_id);


--
-- Name: antecedent_therapeutic_patient_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX antecedent_therapeutic_patient_id_idx ON public.antecedent_therapeutic USING btree (patient_id) WITH (fillfactor='100', deduplicate_items='true');


--
-- Name: habitudes_vie_patient_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX habitudes_vie_patient_id_idx ON public.habitudes_vie USING btree (patient_id);


--
-- Name: idx_audit_action; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_action ON public.audit_logs USING btree (action);


--
-- Name: idx_audit_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_date ON public.audit_logs USING btree (created_at);


--
-- Name: idx_audit_logs_action_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_action_created ON public.audit_logs USING btree (action, created_at DESC);


--
-- Name: idx_audit_logs_anomaly_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_anomaly_created ON public.audit_logs USING btree (is_anomaly, created_at DESC);


--
-- Name: idx_audit_logs_created_at_desc; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_created_at_desc ON public.audit_logs USING btree (created_at DESC);


--
-- Name: idx_audit_logs_module_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_module_created ON public.audit_logs USING btree (module, created_at DESC);


--
-- Name: idx_audit_logs_patient_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_patient_created ON public.audit_logs USING btree (patient_id, created_at DESC);


--
-- Name: idx_audit_logs_user_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_user_created ON public.audit_logs USING btree (user_id, created_at DESC);


--
-- Name: idx_audit_patient; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_patient ON public.audit_logs USING btree (patient_id);


--
-- Name: idx_audit_user; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_user ON public.audit_logs USING btree (user_id);


--
-- Name: idx_mv_dim_population_pid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_mv_dim_population_pid ON public.mv_dim_population USING btree (patient_id);


--
-- Name: idx_mv_dim_statut_patient_pid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_mv_dim_statut_patient_pid ON public.mv_dim_statut_patient USING btree (patient_id);


--
-- Name: idx_mv_dim_statut_viral_pid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_mv_dim_statut_viral_pid ON public.mv_dim_statut_viral USING btree (patient_id);


--
-- Name: idx_mv_fait_nouveaux_annee; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mv_fait_nouveaux_annee ON public.mv_fait_nouveaux_malades USING btree (annee);


--
-- Name: idx_mv_fait_nouveaux_pid; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX idx_mv_fait_nouveaux_pid ON public.mv_fait_nouveaux_malades USING btree (patient_id);


--
-- Name: idx_mv_fait_nouveaux_seuil; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mv_fait_nouveaux_seuil ON public.mv_fait_nouveaux_malades USING btree (seuil_cd4);


--
-- Name: idx_mv_fait_nouveaux_trimestre; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_mv_fait_nouveaux_trimestre ON public.mv_fait_nouveaux_malades USING btree (annee, trimestre);


--
-- Name: idx_notif_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notif_created_at ON public.notifications USING btree (created_at DESC);


--
-- Name: idx_notif_patient_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notif_patient_id ON public.notifications USING btree (patient_id);


--
-- Name: idx_notif_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_notif_type ON public.notifications USING btree (type);


--
-- Name: idx_stock_medicaments_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_medicaments_code ON public.stock_medicaments USING btree (code);


--
-- Name: addresses addresses_postal_code_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_postal_code_id_fkey FOREIGN KEY (postal_code_id) REFERENCES public.postal_codes(id);


--
-- Name: antecedent_family antecedent_family_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_family
    ADD CONSTRAINT antecedent_family_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: antecedent_family antecedent_family_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_family
    ADD CONSTRAINT antecedent_family_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: antecedent_gyneco antecedent_gyneco_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_gyneco
    ADD CONSTRAINT antecedent_gyneco_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: antecedent_gyneco antecedent_gyneco_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_gyneco
    ADD CONSTRAINT antecedent_gyneco_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: antecedent_medical antecedent_medical_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_medical
    ADD CONSTRAINT antecedent_medical_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: antecedent_medical antecedent_medical_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_medical
    ADD CONSTRAINT antecedent_medical_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: antecedent_surgical antecedent_surgical_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_surgical
    ADD CONSTRAINT antecedent_surgical_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: antecedent_therapeutic antecedent_therapeutic_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_therapeutic
    ADD CONSTRAINT antecedent_therapeutic_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: antecedent_therapeutic antecedent_therapeutic_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_therapeutic
    ADD CONSTRAINT antecedent_therapeutic_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: antecedent_tpe_prep antecedent_tpe_prep_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_tpe_prep
    ADD CONSTRAINT antecedent_tpe_prep_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: antecedent_transfusion antecedent_transfusion_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.antecedent_transfusion
    ADD CONSTRAINT antecedent_transfusion_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: audit_logs audit_logs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: doctor_conclusions doctor_conclusions_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_conclusions
    ADD CONSTRAINT doctor_conclusions_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.users(id) ON DELETE RESTRICT;


--
-- Name: emergency_contacts emergency_contacts_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_contacts
    ADD CONSTRAINT emergency_contacts_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: autres_signes_cliniques fk_autres_signes_appareil; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autres_signes_cliniques
    ADD CONSTRAINT fk_autres_signes_appareil FOREIGN KEY (appareil_id) REFERENCES public.ref_appareil_fonctionnel(id) ON DELETE CASCADE;


--
-- Name: autres_signes_fonctionnels fk_autres_signes_appareil; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autres_signes_fonctionnels
    ADD CONSTRAINT fk_autres_signes_appareil FOREIGN KEY (appareil_id) REFERENCES public.ref_appareil_fonctionnel(id) ON DELETE CASCADE;


--
-- Name: autres_signes_cliniques fk_autres_signes_cliniques; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autres_signes_cliniques
    ADD CONSTRAINT fk_autres_signes_cliniques FOREIGN KEY (signes_cliniques_id) REFERENCES public.signes_cliniques(id) ON DELETE CASCADE;


--
-- Name: autres_signes_fonctionnels fk_autres_signes_fonctionnels; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.autres_signes_fonctionnels
    ADD CONSTRAINT fk_autres_signes_fonctionnels FOREIGN KEY (signes_fonctionnels_id) REFERENCES public.signes_fonctionnels(id) ON DELETE CASCADE;


--
-- Name: examen_clinique fk_examen_medecin; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.examen_clinique
    ADD CONSTRAINT fk_examen_medecin FOREIGN KEY (medecin_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: observations fk_observations_examen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.observations
    ADD CONSTRAINT fk_observations_examen FOREIGN KEY (examen_clinique_id) REFERENCES public.examen_clinique(id) ON DELETE CASCADE;


--
-- Name: signes_cliniques fk_signes_cliniques_examen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signes_cliniques
    ADD CONSTRAINT fk_signes_cliniques_examen FOREIGN KEY (examen_clinique_id) REFERENCES public.examen_clinique(id) ON DELETE CASCADE;


--
-- Name: signes_fonctionnels fk_signes_fonctionnels_examen; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.signes_fonctionnels
    ADD CONSTRAINT fk_signes_fonctionnels_examen FOREIGN KEY (examen_clinique_id) REFERENCES public.examen_clinique(id) ON DELETE CASCADE;


--
-- Name: habitudes_vie habitudes_vie_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habitudes_vie
    ADD CONSTRAINT habitudes_vie_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: habitudes_vie habitudes_vie_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.habitudes_vie
    ADD CONSTRAINT habitudes_vie_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: notifications notifications_prescription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescription_medicale(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_rdv_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_rdv_id_fkey FOREIGN KEY (rdv_id) REFERENCES public.rendezvous(id) ON DELETE CASCADE;


--
-- Name: notifications notifications_suivi_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_suivi_id_fkey FOREIGN KEY (suivi_id) REFERENCES public.suivi_therapeutique(id) ON DELETE CASCADE;


--
-- Name: password_resets password_resets_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.password_resets
    ADD CONSTRAINT password_resets_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: patients patients_birth_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_birth_address_id_fkey FOREIGN KEY (birth_address_id) REFERENCES public.addresses(id);


--
-- Name: patients patients_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: patients patients_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: patients patients_residence_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_residence_address_id_fkey FOREIGN KEY (residence_address_id) REFERENCES public.addresses(id);


--
-- Name: patients patients_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: patients patients_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: postal_codes postal_codes_governorate_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.postal_codes
    ADD CONSTRAINT postal_codes_governorate_id_fkey FOREIGN KEY (governorate_id) REFERENCES public.governorates(id) ON DELETE CASCADE;


--
-- Name: prescription_lignes prescription_lignes_medicament_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescription_lignes
    ADD CONSTRAINT prescription_lignes_medicament_id_fkey FOREIGN KEY (medicament_id) REFERENCES public.stock_medicaments(id) ON DELETE SET NULL;


--
-- Name: prescription_medicale prescription_medicale_medecin_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescription_medicale
    ADD CONSTRAINT prescription_medicale_medecin_id_fkey FOREIGN KEY (medecin_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: social social_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social
    ADD CONSTRAINT social_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: social social_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social
    ADD CONSTRAINT social_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- Name: stock_medicaments stock_medicaments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_medicaments
    ADD CONSTRAINT stock_medicaments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: stock_medicaments stock_medicaments_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_medicaments
    ADD CONSTRAINT stock_medicaments_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- Name: suivi_therapeutique suivi_therapeutique_prescription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suivi_therapeutique
    ADD CONSTRAINT suivi_therapeutique_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescription_medicale(id) ON DELETE CASCADE;


--
-- Name: vih vih_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vih
    ADD CONSTRAINT vih_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id);


--
-- Name: vih vih_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vih
    ADD CONSTRAINT vih_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

-- Le dump restaure un search_path vide. Les donnees ajoutees a la fin
-- doivent cibler explicitement le schema public pour fonctionner en init Docker.
SET search_path = public;

-- =========================================================
-- REFERENTIELS ADRESSES
-- =========================================================
INSERT INTO governorates (name) VALUES
('ARIANA'),
('BEJA'),
('BEN AROUS'),
('BIZERTE'),
('GABES'),
('GAFSA'),
('JENDOUBA'),
('KAIROUAN'),
('KASSERINE'),
('KEBILI'),
('KEF'),
('MAHDIA'),
('MANOUBA'),
('MEDENINE'),
('MONASTIR'),
('NABEUL'),
('SFAX'),
('SIDI BOUZID'),
('SILIANA'),
('SOUSSE'),
('TATAOUINE'),
('TOZEUR'),
('TUNIS'),
('ZAGHOUAN')
ON CONFLICT (name) DO NOTHING;

-- Source: https://github.com/Mehdi1chouk/Tunisia_Governorates/blob/master/state-municipality.json
-- Insertion de donnees a partir du JSON des codes postaux de la Tunisie
WITH raw AS (
  SELECT $$[
  {
    "Name": "ARIANA",
    "NameAr": "Ø£Ø±ÙŠØ§Ù†Ø©",
    "Value": "ARIANA",
    "Delegations": [
      {
        "Name": "ARIANA VILLE",
        "NameAr": "Ø£Ø±ÙŠØ§Ù†Ø© Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©",
        "Value": "ARIANA VILLE",
        "PostalCode": "2058",
        "Latitude": 36.866474,
        "Longitude": 10.164726
      },
      {
        "Name": "SIDI THABET",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø«Ø§Ø¨Øª",
        "Value": "SIDI THABET",
        "PostalCode": "2020",
        "Latitude": 36.898614,
        "Longitude": 10.030632
      },
      {
        "Name": "LA SOUKRA",
        "NameAr": "Ø³ÙƒØ±Ø©",
        "Value": "LA SOUKRA",
        "PostalCode": "2036",
        "Latitude": 36.883618,
        "Longitude": 10.240874
      },
      {
        "Name": "KALAAT LANDLOUS",
        "NameAr": "Ù‚Ù„Ø¹Ø© Ø§Ù„Ø£Ù†Ø¯Ù„Ø³",
        "Value": "KALAAT LANDLOUS",
        "PostalCode": "2061",
        "Latitude": 37.066667,
        "Longitude": 10.183333
      },
      {
        "Name": "RAOUED",
        "NameAr": "Ø±ÙˆØ§Ø¯",
        "Value": "RAOUED",
        "PostalCode": "2083",
        "Latitude": 36.931944,
        "Longitude": 10.160278
      },
      {
        "Name": "MNIHLA",
        "NameAr": "Ø§Ù„Ù…Ù†ÙŠÙ‡Ù„Ø©",
        "Value": "MNIHLA",
        "PostalCode": "2094",
        "Latitude": 36.866331,
        "Longitude": 10.089634
      },
      {
        "Name": "ETTADHAMEN",
        "NameAr": "Ø§Ù„ØªØ¶Ø§Ù…Ù†",
        "Value": "ETTADHAMEN",
        "PostalCode": "2041",
        "Latitude": 36.839821,
        "Longitude": 10.099205
      }
    ]
  },
  {
    "Name": "BEJA",
    "NameAr": "Ø¨Ø§Ø¬Ø©",
    "Value": "BEJA",
    "Delegations": [
      {
        "Name": "TESTOUR",
        "NameAr": "ØªØ³ØªÙˆØ±",
        "Value": "TESTOUR",
        "PostalCode": "9014",
        "Latitude": 36.552305,
        "Longitude": 9.444303
      },
      {
        "Name": "TEBOURSOUK",
        "NameAr": "ØªØ¨Ø±Ø³Ù‚",
        "Value": "TEBOURSOUK",
        "PostalCode": "9032",
        "Latitude": 36.458038,
        "Longitude": 9.249001
      },
      {
        "Name": "BEJA NORD",
        "NameAr": "Ø¨Ø§Ø¬Ø© Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "BEJA NORD",
        "PostalCode": "9000",
        "Latitude": 36.728826,
        "Longitude": 9.183218
      },
      {
        "Name": "MEJEZ EL BAB",
        "NameAr": "Ù…Ø¬Ø§Ø² Ø§Ù„Ø¨Ø§Ø¨",
        "Value": "MEJEZ EL BAB",
        "PostalCode": "9034",
        "Latitude": 36.649444,
        "Longitude": 9.609167
      },
      {
        "Name": "NEFZA",
        "NameAr": "Ù†ÙØ²Ø©",
        "Value": "NEFZA",
        "PostalCode": "9010",
        "Latitude": 37.074444,
        "Longitude": 9.085833
      },
      {
        "Name": "BEJA SUD",
        "NameAr": "Ø¨Ø§Ø¬Ø© Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "BEJA SUD",
        "PostalCode": "9021",
        "Latitude": 36.728826,
        "Longitude": 9.183218
      },
      {
        "Name": "THIBAR",
        "NameAr": "ØªÙŠØ¨Ø§Ø±",
        "Value": "THIBAR",
        "PostalCode": "9022",
        "Latitude": 36.611944,
        "Longitude": 9.059722
      },
      {
        "Name": "AMDOUN",
        "NameAr": "Ø¹Ù…Ø¯ÙˆÙ†",
        "Value": "AMDOUN",
        "PostalCode": "9030",
        "Latitude": 36.839167,
        "Longitude": 9.081111
      },
      {
        "Name": "GOUBELLAT",
        "NameAr": "Ù‚Ø¨Ù„Ø§Ø·",
        "Value": "GOUBELLAT",
        "PostalCode": "9080",
        "Latitude": 36.534167,
        "Longitude": 9.600000
      }
    ]
  },
  {
    "Name": "BEN AROUS",
    "NameAr": "Ø¨Ù† Ø¹Ø±ÙˆØ³",
    "Value": "BEN_AROUS",
    "Delegations": [
      {
        "Name": "FOUCHANA",
        "NameAr": "ÙÙˆØ´Ø§Ù†Ø©",
        "Value": "FOUCHANA",
        "PostalCode": "2082",
        "Latitude": 36.703889,
        "Longitude": 10.155000
      },
      {
        "Name": "HAMMAM LIF",
        "NameAr": "Ø­Ù…Ø§Ù… Ø§Ù„Ø£Ù†Ù",
        "Value": "HAMMAM LIF",
        "PostalCode": "2050",
        "Latitude": 36.727778,
        "Longitude": 10.336111
      },
      {
        "Name": "EL MOUROUJ",
        "NameAr": "Ø§Ù„Ù…Ø±ÙˆØ¬",
        "Value": "EL MOUROUJ",
        "PostalCode": "2074",
        "Latitude": 36.739889,
        "Longitude": 10.205000
      },
      {
        "Name": "BOU MHEL EL BASSATINE",
        "NameAr": "Ø¨ÙˆÙ…Ù‡Ù„ Ø§Ù„Ø¨Ø³Ø§ØªÙŠÙ†",
        "Value": "BOU MHEL EL BASSATINE",
        "PostalCode": "2097",
        "Latitude": 36.729444,
        "Longitude": 10.280000
      },
      {
        "Name": "RADES",
        "NameAr": "Ø±Ø§Ø¯Ø³",
        "Value": "RADES",
        "PostalCode": "2098",
        "Latitude": 36.766667,
        "Longitude": 10.283333
      },
      {
        "Name": "MOHAMADIA",
        "NameAr": "Ø§Ù„Ù…Ø­Ù…Ø¯ÙŠØ©",
        "Value": "MOHAMADIA",
        "PostalCode": "1145",
        "Latitude": 36.689444,
        "Longitude": 10.131389
      },
      {
        "Name": "MEGRINE",
        "NameAr": "Ù…Ù‚Ø±ÙŠÙ†",
        "Value": "MEGRINE",
        "PostalCode": "2033",
        "Latitude": 36.781111,
        "Longitude": 10.238333
      },
      {
        "Name": "NOUVELLE MEDINA",
        "NameAr": "Ø§Ù„Ù…Ø¯ÙŠÙ†Ø© Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©",
        "Value": "NOUVELLE MEDINA",
        "PostalCode": "2063",
        "Latitude": 36.753889,
        "Longitude": 10.232222
      },
      {
        "Name": "HAMMAM CHATT",
        "NameAr": "Ø­Ù…Ø§Ù… Ø§Ù„Ø´Ø·",
        "Value": "HAMMAM CHATT",
        "PostalCode": "1164",
        "Latitude": 36.700000,
        "Longitude": 10.366667
      },
      {
        "Name": "MORNAG",
        "NameAr": "Ù…Ø±Ù†Ø§Ù‚",
        "Value": "MORNAG",
        "PostalCode": "2064",
        "Latitude": 36.633333,
        "Longitude": 10.250000
      },
      {
        "Name": "EZZAHRA",
        "NameAr": "Ø§Ù„Ø²Ù‡Ø±Ø§Ø¡",
        "Value": "EZZAHRA",
        "PostalCode": "2034",
        "Latitude": 36.743333,
        "Longitude": 10.308333
      },
      {
        "Name": "BEN AROUS",
        "NameAr": "Ø¨Ù† Ø¹Ø±ÙˆØ³",
        "Value": "BEN AROUS",
        "PostalCode": "2043",
        "Latitude": 36.748333,
        "Longitude": 10.222500
      }
    ]
  },
  {
    "Name": "BIZERTE",
    "NameAr": "Ø¨Ù†Ø²Ø±Øª",
    "Value": "BIZERTE",
    "Delegations": [
      {
        "Name": "MENZEL JEMIL",
        "NameAr": "Ù…Ù†Ø²Ù„ Ø¬Ù…ÙŠÙ„",
        "Value": "MENZEL JEMIL",
        "PostalCode": "7035",
        "Latitude": 37.233333,
        "Longitude": 9.916667
      },
      {
        "Name": "BIZERTE SUD",
        "NameAr": "Ø¨Ù†Ø²Ø±Øª Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "BIZERTE SUD",
        "PostalCode": "7071",
        "Latitude": 37.274444,
        "Longitude": 9.873889
      },
      {
        "Name": "SEJNANE",
        "NameAr": "Ø³Ø¬Ù†Ø§Ù†",
        "Value": "SEJNANE",
        "PostalCode": "7010",
        "Latitude": 37.153889,
        "Longitude": 9.238889
      },
      {
        "Name": "GHAR EL MELH",
        "NameAr": "ØºØ§Ø± Ø§Ù„Ù…Ù„Ø­",
        "Value": "GHAR EL MELH",
        "PostalCode": "7024",
        "Latitude": 37.166667,
        "Longitude": 10.193056
      },
      {
        "Name": "MENZEL BOURGUIBA",
        "NameAr": "Ù…Ù†Ø²Ù„ Ø¨ÙˆØ±Ù‚ÙŠØ¨Ø©",
        "Value": "MENZEL BOURGUIBA",
        "PostalCode": "7072",
        "Latitude": 37.150000,
        "Longitude": 9.783333
      },
      {
        "Name": "RAS JEBEL",
        "NameAr": "Ø±Ø£Ø³ Ø§Ù„Ø¬Ø¨Ù„",
        "Value": "RAS JEBEL",
        "PostalCode": "7025",
        "Latitude": 37.214722,
        "Longitude": 10.121389
      },
      {
        "Name": "GHEZALA",
        "NameAr": "ØºØ²Ø§Ù„Ø©",
        "Value": "GHEZALA",
        "PostalCode": "7040",
        "Latitude": 37.116667,
        "Longitude": 9.533333
      },
      {
        "Name": "JOUMINE",
        "NameAr": "Ø¬ÙˆÙ…ÙŠÙ†",
        "Value": "JOUMINE",
        "PostalCode": "7012",
        "Latitude": 36.950000,
        "Longitude": 9.400000
      },
      {
        "Name": "UTIQUE",
        "NameAr": "Ø£ÙˆØªÙŠÙƒ",
        "Value": "UTIQUE",
        "PostalCode": "7013",
        "Latitude": 37.052500,
        "Longitude": 10.058889
      },
      {
        "Name": "BIZERTE NORD",
        "NameAr": "Ø¨Ù†Ø²Ø±Øª Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "BIZERTE NORD",
        "PostalCode": "7029",
        "Latitude": 37.274444,
        "Longitude": 9.873889
      },
      {
        "Name": "EL ALIA",
        "NameAr": "Ø§Ù„Ø¹Ø§Ù„ÙŠØ©",
        "Value": "EL ALIA",
        "PostalCode": "7081",
        "Latitude": 37.169167,
        "Longitude": 10.045000
      },
      {
        "Name": "MATEUR",
        "NameAr": "Ù…Ø§Ø·Ø±",
        "Value": "MATEUR",
        "PostalCode": "7030",
        "Latitude": 37.040278,
        "Longitude": 9.665556
      },
      {
        "Name": "JARZOUNA",
        "NameAr": "Ø¬Ø±Ø²ÙˆÙ†Ø©",
        "Value": "JARZOUNA",
        "PostalCode": "7021",
        "Latitude": 37.258889,
        "Longitude": 9.882222
      },
      {
        "Name": "TINJA",
        "NameAr": "ØªÙŠÙ†Ø¬Ø©",
        "Value": "TINJA",
        "PostalCode": "7032",
        "Latitude": 37.161667,
        "Longitude": 9.759444
      }
    ]
  },
  {
    "Name": "GABES",
    "NameAr": "Ù‚Ø§Ø¨Ø³",
    "Value": "GABES",
    "Delegations": [
      {
        "Name": "GABES SUD",
        "NameAr": "Ù‚Ø§Ø¨Ø³ Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "GABES SUD",
        "PostalCode": "6012",
        "Latitude": 33.881453,
        "Longitude": 10.098195
      },
      {
        "Name": "MATMATA",
        "NameAr": "Ù…Ø·Ù…Ø§Ø·Ø©",
        "Value": "MATMATA",
        "PostalCode": "6034",
        "Latitude": 33.542778,
        "Longitude": 9.974722
      },
      {
        "Name": "MARETH",
        "NameAr": "Ù…Ø§Ø±Ø«",
        "Value": "MARETH",
        "PostalCode": "6080",
        "Latitude": 33.627778,
        "Longitude": 10.295833
      },
      {
        "Name": "EL HAMMA",
        "NameAr": "Ø§Ù„Ø­Ø§Ù…Ø©",
        "Value": "EL HAMMA",
        "PostalCode": "6013",
        "Latitude": 33.888889,
        "Longitude": 9.794444
      },
      {
        "Name": "NOUVELLE MATMATA",
        "NameAr": "Ù…Ø·Ù…Ø§Ø·Ø© Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©",
        "Value": "NOUVELLE MATMATA",
        "PostalCode": "6044",
        "Latitude": 33.702222,
        "Longitude": 10.025278
      },
      {
        "Name": "GABES MEDINA",
        "NameAr": "Ù‚Ø§Ø¨Ø³ Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©",
        "Value": "GABES MEDINA",
        "PostalCode": "6040",
        "Latitude": 33.886300,
        "Longitude": 10.112800
      },
      {
        "Name": "GABES OUEST",
        "NameAr": "Ù‚Ø§Ø¨Ø³ Ø§Ù„ØºØ±Ø¨ÙŠØ©",
        "Value": "GABES OUEST",
        "PostalCode": "6041",
        "Latitude": 33.881453,
        "Longitude": 10.098195
      },
      {
        "Name": "EL METOUIA",
        "NameAr": "Ø§Ù„Ù…Ø·ÙˆÙŠØ©",
        "Value": "EL METOUIA",
        "PostalCode": "6052",
        "Latitude": 33.961111,
        "Longitude": 10.005556
      },
      {
        "Name": "GHANNOUCHE",
        "NameAr": "ØºÙ†ÙˆØ´",
        "Value": "GHANNOUCHE",
        "PostalCode": "6021",
        "Latitude": 33.933333,
        "Longitude": 10.066667
      },
      {
        "Name": "MENZEL HABIB",
        "NameAr": "Ù…Ù†Ø²Ù„ Ø§Ù„Ø­Ø¨ÙŠØ¨",
        "Value": "MENZEL HABIB",
        "PostalCode": "6030",
        "Latitude": 34.125833,
        "Longitude": 9.703333
      }
    ]
  },
  {
    "Name": "GAFSA",
    "NameAr": "Ù‚ÙØµØ©",
    "Value": "GAFSA",
    "Delegations": [
      {
        "Name": "BELKHIR",
        "NameAr": "Ø¨Ù„Ø®ÙŠØ±",
        "Value": "BELKHIR",
        "PostalCode": "2135",
        "Latitude": 34.466667,
        "Longitude": 9.066667
      },
      {
        "Name": "GAFSA NORD",
        "NameAr": "Ù‚ÙØµØ© Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "GAFSA NORD",
        "PostalCode": "2196",
        "Latitude": 34.425000,
        "Longitude": 8.784167
      },
      {
        "Name": "SNED",
        "NameAr": "Ø§Ù„Ø³Ù†Ø¯",
        "Value": "SNED",
        "PostalCode": "2116",
        "Latitude": 34.472222,
        "Longitude": 9.211111
      },
      {
        "Name": "REDEYEF",
        "NameAr": "Ø§Ù„Ø±Ø¯ÙŠÙ",
        "Value": "REDEYEF",
        "PostalCode": "2140",
        "Latitude": 34.383333,
        "Longitude": 8.150000
      },
      {
        "Name": "GAFSA SUD",
        "NameAr": "Ù‚ÙØµØ© Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "GAFSA SUD",
        "PostalCode": "2100",
        "Latitude": 34.425000,
        "Longitude": 8.784167
      },
      {
        "Name": "EL GUETTAR",
        "NameAr": "Ø§Ù„Ù‚Ø·Ø§Ø±",
        "Value": "EL GUETTAR",
        "PostalCode": "2145",
        "Latitude": 34.328333,
        "Longitude": 8.951944
      },
      {
        "Name": "EL KSAR",
        "NameAr": "Ø§Ù„Ù‚ØµØ±",
        "Value": "EL KSAR",
        "PostalCode": "2151",
        "Latitude": 34.400000,
        "Longitude": 8.816667
      },
      {
        "Name": "MOULARES",
        "NameAr": "Ø£Ù… Ø§Ù„Ø¹Ø±Ø§Ø¦Ø³",
        "Value": "MOULARES",
        "PostalCode": "2161",
        "Latitude": 34.494444,
        "Longitude": 8.251944
      },
      {
        "Name": "EL MDHILLA",
        "NameAr": "Ø§Ù„Ù…Ø¸ÙŠÙ„Ø©",
        "Value": "EL MDHILLA",
        "PostalCode": "2170",
        "Latitude": 34.323333,
        "Longitude": 8.602500
      },
      {
        "Name": "METLAOUI",
        "NameAr": "Ø§Ù„Ù…ØªÙ„ÙˆÙŠ",
        "Value": "METLAOUI",
        "PostalCode": "2130",
        "Latitude": 34.325833,
        "Longitude": 8.401389
      },
      {
        "Name": "SIDI AICH",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø¹ÙŠØ´",
        "Value": "SIDI AICH",
        "PostalCode": "2131",
        "Latitude": 34.600000,
        "Longitude": 8.883333
      }
    ]
  },
  {
    "Name": "JENDOUBA",
    "NameAr": "Ø¬Ù†Ø¯ÙˆØ¨Ø©",
    "Value": "JENDOUBA",
    "Delegations": [
      {
        "Name": "BALTA BOU AOUENE",
        "NameAr": "Ø¨Ù„Ø·Ø© Ø¨ÙˆØ¹ÙˆØ§Ù†",
        "Value": "BALTA BOU AOUENE",
        "PostalCode": "8116",
        "Latitude": 36.450000,
        "Longitude": 8.966667
      },
      {
        "Name": "FERNANA",
        "NameAr": "ÙØ±Ù†Ø§Ù†Ø©",
        "Value": "FERNANA",
        "PostalCode": "8142",
        "Latitude": 36.652500,
        "Longitude": 8.693056
      },
      {
        "Name": "JENDOUBA NORD",
        "NameAr": "Ø¬Ù†Ø¯ÙˆØ¨Ø© Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "JENDOUBA NORD",
        "PostalCode": "8189",
        "Latitude": 36.501000,
        "Longitude": 8.780000
      },
      {
        "Name": "AIN DRAHAM",
        "NameAr": "Ø¹ÙŠÙ† Ø¯Ø±Ø§Ù‡Ù…",
        "Value": "AIN DRAHAM",
        "PostalCode": "8121",
        "Latitude": 36.777500,
        "Longitude": 8.691944
      },
      {
        "Name": "TABARKA",
        "NameAr": "Ø·Ø¨Ø±Ù‚Ø©",
        "Value": "TABARKA",
        "PostalCode": "8192",
        "Latitude": 36.954444,
        "Longitude": 8.758056
      },
      {
        "Name": "JENDOUBA",
        "NameAr": "Ø¬Ù†Ø¯ÙˆØ¨Ø©",
        "Value": "JENDOUBA",
        "PostalCode": "8122",
        "Latitude": 36.501000,
        "Longitude": 8.780000
      },
      {
        "Name": "BOU SALEM",
        "NameAr": "Ø¨ÙˆØ³Ø§Ù„Ù…",
        "Value": "BOU SALEM",
        "PostalCode": "8143",
        "Latitude": 36.611667,
        "Longitude": 8.968889
      },
      {
        "Name": "OUED MLIZ",
        "NameAr": "ÙˆØ§Ø¯ÙŠ Ù…Ù„ÙŠØ²",
        "Value": "OUED MLIZ",
        "PostalCode": "8193",
        "Latitude": 36.466667,
        "Longitude": 8.550000
      },
      {
        "Name": "GHARDIMAOU",
        "NameAr": "ØºØ§Ø± Ø§Ù„Ø¯Ù…Ø§Ø¡",
        "Value": "GHARDIMAOU",
        "PostalCode": "8160",
        "Latitude": 36.479444,
        "Longitude": 8.439722
      }
    ]
  },
  {
    "Name": "KAIROUAN",
    "NameAr": "Ø§Ù„Ù‚ÙŠØ±ÙˆØ§Ù†",
    "Value": "KAIROUAN",
    "Delegations": [
      {
        "Name": "CHEBIKA",
        "NameAr": "Ø§Ù„Ø´Ø¨ÙŠÙƒØ©",
        "Value": "CHEBIKA",
        "PostalCode": "3121",
        "Latitude": 35.683333,
        "Longitude": 9.750000
      },
      {
        "Name": "EL ALA",
        "NameAr": "Ø§Ù„Ø¹Ù„Ø§",
        "Value": "EL ALA",
        "PostalCode": "3154",
        "Latitude": 35.608333,
        "Longitude": 9.550000
      },
      {
        "Name": "OUESLATIA",
        "NameAr": "Ø§Ù„ÙˆØ³Ù„Ø§ØªÙŠØ©",
        "Value": "OUESLATIA",
        "PostalCode": "3124",
        "Latitude": 35.850000,
        "Longitude": 9.600000
      },
      {
        "Name": "HAJEB EL AYOUN",
        "NameAr": "Ø­Ø§Ø¬Ø¨ Ø§Ù„Ø¹ÙŠÙˆÙ†",
        "Value": "HAJEB EL AYOUN",
        "PostalCode": "3160",
        "Latitude": 35.383333,
        "Longitude": 9.550000
      },
      {
        "Name": "SBIKHA",
        "NameAr": "Ø§Ù„Ø³Ø¨ÙŠØ®Ø©",
        "Value": "SBIKHA",
        "PostalCode": "3125",
        "Latitude": 35.933333,
        "Longitude": 10.000000
      },
      {
        "Name": "BOU HAJLA",
        "NameAr": "Ø¨ÙˆØ­Ø¬Ù„Ø©",
        "Value": "BOU HAJLA",
        "PostalCode": "3126",
        "Latitude": 35.250000,
        "Longitude": 10.016667
      },
      {
        "Name": "KAIROUAN NORD",
        "NameAr": "Ø§Ù„Ù‚ÙŠØ±ÙˆØ§Ù† Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "KAIROUAN NORD",
        "PostalCode": "3129",
        "Latitude": 35.678056,
        "Longitude": 10.096306
      },
      {
        "Name": "HAFFOUZ",
        "NameAr": "Ø­ÙÙˆØ²",
        "Value": "HAFFOUZ",
        "PostalCode": "3130",
        "Latitude": 35.633333,
        "Longitude": 9.666667
      },
      {
        "Name": "KAIROUAN SUD",
        "NameAr": "Ø§Ù„Ù‚ÙŠØ±ÙˆØ§Ù† Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "KAIROUAN SUD",
        "PostalCode": "3131",
        "Latitude": 35.678056,
        "Longitude": 10.096306
      },
      {
        "Name": "NASRALLAH",
        "NameAr": "Ù†ØµØ± Ø§Ù„Ù„Ù‡",
        "Value": "NASRALLAH",
        "PostalCode": "3170",
        "Latitude": 35.050000,
        "Longitude": 9.733333
      },
      {
        "Name": "CHERARDA",
        "NameAr": "Ø§Ù„Ø´Ø±Ø§Ø±Ø¯Ø©",
        "Value": "CHERARDA",
        "PostalCode": "3145",
        "Latitude": 35.452222,
        "Longitude": 10.230000
      }
    ]
  },
  {
    "Name": "KASSERINE",
    "NameAr": "Ø§Ù„Ù‚ØµØ±ÙŠÙ†",
    "Value": "KASSERINE",
    "Delegations": [
      {
        "Name": "SBEITLA",
        "NameAr": "Ø³Ø¨ÙŠØ·Ù„Ø©",
        "Value": "SBEITLA",
        "PostalCode": "1250",
        "Latitude": 35.233333,
        "Longitude": 9.133333
      },
      {
        "Name": "FOUSSANA",
        "NameAr": "ÙÙˆØ³Ø§Ù†Ø©",
        "Value": "FOUSSANA",
        "PostalCode": "1220",
        "Latitude": 35.100000,
        "Longitude": 8.666667
      },
      {
        "Name": "KASSERINE NORD",
        "NameAr": "Ø§Ù„Ù‚ØµØ±ÙŠÙ† Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "KASSERINE NORD",
        "PostalCode": "1253",
        "Latitude": 35.167600,
        "Longitude": 8.830200
      },
      {
        "Name": "HAIDRA",
        "NameAr": "Ø­ÙŠØ¯Ø±Ø©",
        "Value": "HAIDRA",
        "PostalCode": "1221",
        "Latitude": 35.562500,
        "Longitude": 8.494444
      },
      {
        "Name": "THALA",
        "NameAr": "ØªØ§Ù„Ø©",
        "Value": "THALA",
        "PostalCode": "1210",
        "Latitude": 35.575000,
        "Longitude": 8.672222
      },
      {
        "Name": "SBIBA",
        "NameAr": "Ø³Ø¨ÙŠØ¨Ø©",
        "Value": "SBIBA",
        "PostalCode": "1270",
        "Latitude": 35.550000,
        "Longitude": 9.066667
      },
      {
        "Name": "FERIANA",
        "NameAr": "ÙØ±ÙŠØ§Ù†Ø©",
        "Value": "FERIANA",
        "PostalCode": "1240",
        "Latitude": 34.950000,
        "Longitude": 8.583333
      },
      {
        "Name": "MEJEL BEL ABBES",
        "NameAr": "Ù…Ø§Ø¬Ù„ Ø¨Ù„Ø¹Ø¨Ø§Ø³",
        "Value": "MEJEL BEL ABBES",
        "PostalCode": "1226",
        "Latitude": 34.800000,
        "Longitude": 8.833333
      },
      {
        "Name": "KASSERINE SUD",
        "NameAr": "Ø§Ù„Ù‚ØµØ±ÙŠÙ† Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "KASSERINE SUD",
        "PostalCode": "1233",
        "Latitude": 35.167600,
        "Longitude": 8.830200
      },
      {
        "Name": "EL AYOUN",
        "NameAr": "Ø§Ù„Ø¹ÙŠÙˆÙ†",
        "Value": "EL AYOUN",
        "PostalCode": "1234",
        "Latitude": 35.383333,
        "Longitude": 8.700000
      },
      {
        "Name": "EZZOUHOUR  (KASSERINE)",
        "NameAr": "Ø§Ù„Ø²Ù‡ÙˆØ± (Ø§Ù„Ù‚ØµØ±ÙŠÙ†)",
        "Value": "EZZOUHOUR  (KASSERINE)",
        "PostalCode": "1279",
        "Latitude": 35.183300,
        "Longitude": 8.800000
      },
      {
        "Name": "JEDILIANE",
        "NameAr": "Ø¬Ø¯Ù„ÙŠØ§Ù†",
        "Value": "JEDILIANE",
        "PostalCode": "1280",
        "Latitude": 35.616667,
        "Longitude": 9.183333
      },
      {
        "Name": "HASSI EL FRID",
        "NameAr": "Ø­Ø§Ø³ÙŠ Ø§Ù„ÙØ±ÙŠØ¯",
        "Value": "HASSI EL FRID",
        "PostalCode": "1241",
        "Latitude": 34.933333,
        "Longitude": 9.000000
      }
    ]
  },
  {
    "Name": "KEBILI",
    "NameAr": "Ù‚Ø¨Ù„ÙŠ",
    "Value": "KEBILI",
    "Delegations": [
      {
        "Name": "SOUK EL AHAD",
        "NameAr": "Ø³ÙˆÙ‚ Ø§Ù„Ø£Ø­Ø¯",
        "Value": "SOUK EL AHAD",
        "PostalCode": "4223",
        "Latitude": 33.700000,
        "Longitude": 8.950000
      },
      {
        "Name": "KEBILI SUD",
        "NameAr": "Ù‚Ø¨Ù„ÙŠ Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "KEBILI SUD",
        "PostalCode": "4224",
        "Latitude": 33.705111,
        "Longitude": 8.872306
      },
      {
        "Name": "KEBILI NORD",
        "NameAr": "Ù‚Ø¨Ù„ÙŠ Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "KEBILI NORD",
        "PostalCode": "4232",
        "Latitude": 33.705111,
        "Longitude": 8.872306
      },
      {
        "Name": "DOUZ",
        "NameAr": "Ø¯ÙˆØ²",
        "Value": "DOUZ",
        "PostalCode": "4234",
        "Latitude": 33.458889,
        "Longitude": 9.025556
      },
      {
        "Name": "EL FAOUAR",
        "NameAr": "Ø§Ù„ÙÙˆØ§Ø±",
        "Value": "EL FAOUAR",
        "PostalCode": "4264",
        "Latitude": 33.350000,
        "Longitude": 8.616667
      }
    ]
  },
  {
    "Name": "KEF",
    "NameAr": "Ø§Ù„ÙƒØ§Ù",
    "Value": "KEF",
    "Delegations": [
      {
        "Name": "TAJEROUINE",
        "NameAr": "ØªØ§Ø¬Ø±ÙˆÙŠÙ†",
        "Value": "TAJEROUINE",
        "PostalCode": "7150",
        "Latitude": 35.883333,
        "Longitude": 8.616667
      },
      {
        "Name": "DAHMANI",
        "NameAr": "Ø§Ù„Ø¯Ù‡Ù…Ø§Ù†ÙŠ",
        "Value": "DAHMANI",
        "PostalCode": "7170",
        "Latitude": 35.950000,
        "Longitude": 8.816667
      },
      {
        "Name": "LE KEF EST",
        "NameAr": "Ø§Ù„ÙƒØ§Ù Ø§Ù„Ø´Ø±Ù‚ÙŠØ©",
        "Value": "LE KEF EST",
        "PostalCode": "7100",
        "Latitude": 36.180278,
        "Longitude": 8.711111
      },
      {
        "Name": "SAKIET SIDI YOUSSEF",
        "NameAr": "Ø³Ø§Ù‚ÙŠØ© Ø³ÙŠØ¯ÙŠ ÙŠÙˆØ³Ù",
        "Value": "SAKIET SIDI YOUSSEF",
        "PostalCode": "7120",
        "Latitude": 36.350000,
        "Longitude": 8.350000
      },
      {
        "Name": "LE SERS",
        "NameAr": "Ø§Ù„Ø³Ø±Ø³",
        "Value": "LE SERS",
        "PostalCode": "7180",
        "Latitude": 36.083333,
        "Longitude": 9.033333
      },
      {
        "Name": "NEBEUR",
        "NameAr": "Ù†Ø¨Ø±",
        "Value": "NEBEUR",
        "PostalCode": "7110",
        "Latitude": 36.366667,
        "Longitude": 8.816667
      },
      {
        "Name": "TOUIREF",
        "NameAr": "Ø§Ù„Ø·ÙˆÙŠØ±Ù",
        "Value": "TOUIREF",
        "PostalCode": "7112",
        "Latitude": 36.283333,
        "Longitude": 8.550000
      },
      {
        "Name": "EL KSOUR",
        "NameAr": "Ø§Ù„Ù‚ØµÙˆØ±",
        "Value": "EL KSOUR",
        "PostalCode": "7160",
        "Latitude": 35.800000,
        "Longitude": 8.866667
      },
      {
        "Name": "KALAA EL KHASBA",
        "NameAr": "Ø§Ù„Ù‚Ù„Ø¹Ø© Ø§Ù„Ø®ØµØ¨Ø§Ø¡",
        "Value": "KALAA EL KHASBA",
        "PostalCode": "7123",
        "Latitude": 35.633333,
        "Longitude": 8.450000
      },
      {
        "Name": "KALAAT SINANE",
        "NameAr": "Ù‚Ù„Ø¹Ø© Ø³Ù†Ø§Ù†",
        "Value": "KALAAT SINANE",
        "PostalCode": "7130",
        "Latitude": 35.950000,
        "Longitude": 8.466667
      },
      {
        "Name": "JERISSA",
        "NameAr": "Ø§Ù„Ø¬Ø±ÙŠØµØ©",
        "Value": "JERISSA",
        "PostalCode": "7114",
        "Latitude": 35.866667,
        "Longitude": 8.633333
      },
      {
        "Name": "LE KEF OUEST",
        "NameAr": "Ø§Ù„ÙƒØ§Ù Ø§Ù„ØºØ±Ø¨ÙŠØ©",
        "Value": "LE KEF OUEST",
        "PostalCode": "7117",
        "Latitude": 36.180278,
        "Longitude": 8.711111
      }
    ]
  },
  {
    "Name": "MAHDIA",
    "NameAr": "Ø§Ù„Ù…Ù‡Ø¯ÙŠØ©",
    "Value": "MAHDIA",
    "Delegations": [
      {
        "Name": "MAHDIA",
        "NameAr": "Ø§Ù„Ù…Ù‡Ø¯ÙŠØ©",
        "Value": "MAHDIA",
        "PostalCode": "5111",
        "Latitude": 35.504722,
        "Longitude": 11.062222
      },
      {
        "Name": "CHORBANE",
        "NameAr": "Ø´Ø±Ø¨Ø§Ù†",
        "Value": "CHORBANE",
        "PostalCode": "5130",
        "Latitude": 35.266667,
        "Longitude": 10.516667
      },
      {
        "Name": "EL JEM",
        "NameAr": "Ø§Ù„Ø¬Ù…",
        "Value": "EL JEM",
        "PostalCode": "5160",
        "Latitude": 35.296389,
        "Longitude": 10.711111
      },
      {
        "Name": "LA CHEBBA",
        "NameAr": "Ø§Ù„Ø´Ø§Ø¨Ø©",
        "Value": "LA CHEBBA",
        "PostalCode": "5170",
        "Latitude": 35.233333,
        "Longitude": 11.116667
      },
      {
        "Name": "BOU MERDES",
        "NameAr": "Ø¨ÙˆÙ…Ø±Ø¯Ø§Ø³",
        "Value": "BOU MERDES",
        "PostalCode": "5112",
        "Latitude": 35.550000,
        "Longitude": 10.766667
      },
      {
        "Name": "KSOUR ESSAF",
        "NameAr": "Ù‚ØµÙˆØ± Ø§Ù„Ø³Ø§Ù",
        "Value": "KSOUR ESSAF",
        "PostalCode": "5180",
        "Latitude": 35.426667,
        "Longitude": 10.990000
      },
      {
        "Name": "SIDI ALOUENE",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø¹Ù„ÙˆØ§Ù†",
        "Value": "SIDI ALOUENE",
        "PostalCode": "5132",
        "Latitude": 35.350000,
        "Longitude": 10.816667
      },
      {
        "Name": "HBIRA",
        "NameAr": "Ù‡Ø¨ÙŠØ±Ø©",
        "Value": "HBIRA",
        "PostalCode": "5113",
        "Latitude": 35.116667,
        "Longitude": 10.400000
      },
      {
        "Name": "MELLOULECH",
        "NameAr": "Ù…Ù„ÙˆÙ„Ø´",
        "Value": "MELLOULECH",
        "PostalCode": "5114",
        "Latitude": 35.316667,
        "Longitude": 11.016667
      },
      {
        "Name": "SOUASSI",
        "NameAr": "Ø§Ù„Ø³ÙˆØ§Ø³ÙŠ",
        "Value": "SOUASSI",
        "PostalCode": "5134",
        "Latitude": 35.350000,
        "Longitude": 10.483333
      },
      {
        "Name": "OULED CHAMAKH",
        "NameAr": "Ø£ÙˆÙ„Ø§Ø¯ Ø§Ù„Ø´Ø§Ù…Ø®",
        "Value": "OULED CHAMAKH",
        "PostalCode": "5120",
        "Latitude": 35.400000,
        "Longitude": 10.300000
      }
    ]
  },
  {
    "Name": "MANNOUBA",
    "NameAr": "Ù…Ù†ÙˆØ¨Ø©",
    "Value": "MANNOUBA",
    "Delegations": [
      {
        "Name": "TEBOURBA",
        "NameAr": "Ø·Ø¨Ø±Ø¨Ø©",
        "Value": "TEBOURBA",
        "PostalCode": "1144",
        "Latitude": 36.829167,
        "Longitude": 9.841667
      },
      {
        "Name": "JEDAIDA",
        "NameAr": "Ø§Ù„Ø¬Ø¯ÙŠØ¯Ø©",
        "Value": "JEDAIDA",
        "PostalCode": "1124",
        "Latitude": 36.808333,
        "Longitude": 9.933333
      },
      {
        "Name": "MORNAGUIA",
        "NameAr": "Ø§Ù„Ù…Ø±Ù†Ø§Ù‚ÙŠØ©",
        "Value": "MORNAGUIA",
        "PostalCode": "1110",
        "Latitude": 36.766667,
        "Longitude": 9.933333
      },
      {
        "Name": "BORJ EL AMRI",
        "NameAr": "Ø¨Ø±Ø¬ Ø§Ù„Ø¹Ø§Ù…Ø±ÙŠ",
        "Value": "BORJ EL AMRI",
        "PostalCode": "1113",
        "Latitude": 36.750000,
        "Longitude": 9.833333
      },
      {
        "Name": "EL BATTAN",
        "NameAr": "Ø§Ù„Ø¨Ø·Ø§Ù†",
        "Value": "EL BATTAN",
        "PostalCode": "1114",
        "Latitude": 36.800000,
        "Longitude": 9.866667
      },
      {
        "Name": "OUED ELLIL",
        "NameAr": "ÙˆØ§Ø¯ÙŠ Ø§Ù„Ù„ÙŠÙ„",
        "Value": "OUED ELLIL",
        "PostalCode": "2021",
        "Latitude": 36.833333,
        "Longitude": 10.050000
      },
      {
        "Name": "DOUAR HICHER",
        "NameAr": "Ø¯ÙˆØ§Ø± Ù‡ÙŠØ´Ø±",
        "Value": "DOUAR HICHER",
        "PostalCode": "2086",
        "Latitude": 36.835000,
        "Longitude": 10.066667
      },
      {
        "Name": "MANNOUBA",
        "NameAr": "Ù…Ù†ÙˆØ¨Ø©",
        "Value": "MANNOUBA",
        "PostalCode": "2010",
        "Latitude": 36.813500,
        "Longitude": 10.095800
      }
    ]
  },
  {
    "Name": "MEDENINE",
    "NameAr": "Ù…Ø¯Ù†ÙŠÙ†",
    "Value": "MEDENINE",
    "Delegations": [
      {
        "Name": "HOUMET ESSOUK",
        "NameAr": "Ø­ÙˆÙ…Ø© Ø§Ù„Ø³ÙˆÙ‚",
        "Value": "HOUMET ESSOUK",
        "PostalCode": "4180",
        "Latitude": 33.875000,
        "Longitude": 10.858333
      },
      {
        "Name": "BENI KHEDACHE",
        "NameAr": "Ø¨Ù†ÙŠ Ø®Ø¯Ø§Ø´",
        "Value": "BENI KHEDACHE",
        "PostalCode": "4110",
        "Latitude": 33.250000,
        "Longitude": 10.200000
      },
      {
        "Name": "AJIM",
        "NameAr": "Ø£Ø¬ÙŠÙ…",
        "Value": "AJIM",
        "PostalCode": "4150",
        "Latitude": 33.720556,
        "Longitude": 10.751944
      },
      {
        "Name": "BEN GUERDANE",
        "NameAr": "Ø¨Ù†Ù‚Ø±Ø¯Ø§Ù†",
        "Value": "BEN GUERDANE",
        "PostalCode": "4153",
        "Latitude": 33.133333,
        "Longitude": 11.216667
      },
      {
        "Name": "ZARZIS",
        "NameAr": "Ø¬Ø±Ø¬ÙŠØ³",
        "Value": "ZARZIS",
        "PostalCode": "4154",
        "Latitude": 33.503889,
        "Longitude": 11.112222
      },
      {
        "Name": "MEDENINE NORD",
        "NameAr": "Ù…Ø¯Ù†ÙŠÙ† Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "MEDENINE NORD",
        "PostalCode": "4111",
        "Latitude": 33.355000,
        "Longitude": 10.505278
      },
      {
        "Name": "MIDOUN",
        "NameAr": "Ù…ÙŠØ¯ÙˆÙ†",
        "Value": "MIDOUN",
        "PostalCode": "4113",
        "Latitude": 33.804722,
        "Longitude": 10.964722
      },
      {
        "Name": "SIDI MAKHLOUF",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ù…Ø®Ù„ÙˆÙ",
        "Value": "SIDI MAKHLOUF",
        "PostalCode": "4181",
        "Latitude": 33.566667,
        "Longitude": 10.450000
      },
      {
        "Name": "MEDENINE SUD",
        "NameAr": "Ù…Ø¯Ù†ÙŠÙ† Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "MEDENINE SUD",
        "PostalCode": "4127",
        "Latitude": 33.355000,
        "Longitude": 10.505278
      }
    ]
  },
  {
    "Name": "MONASTIR",
    "NameAr": "Ø§Ù„Ù…Ù†Ø³ØªÙŠØ±",
    "Value": "MONASTIR",
    "Delegations": [
      {
        "Name": "MONASTIR",
        "NameAr": "Ø§Ù„Ù…Ù†Ø³ØªÙŠØ±",
        "Value": "MONASTIR",
        "PostalCode": "5060",
        "Latitude": 35.764298,
        "Longitude": 10.809098
      },
      {
        "Name": "SAHLINE",
        "NameAr": "Ø§Ù„Ø³Ø§Ø­Ù„ÙŠÙ†",
        "Value": "SAHLINE",
        "PostalCode": "5012",
        "Latitude": 35.750000,
        "Longitude": 10.733333
      },
      {
        "Name": "KSIBET EL MEDIOUNI",
        "NameAr": "Ù‚ØµÙŠØ¨Ø© Ø§Ù„Ù…Ø¯ÙŠÙˆÙ†ÙŠ",
        "Value": "KSIBET EL MEDIOUNI",
        "PostalCode": "5031",
        "Latitude": 35.666667,
        "Longitude": 10.800000
      },
      {
        "Name": "JEMMAL",
        "NameAr": "Ø¬Ù…Ø§Ù„",
        "Value": "JEMMAL",
        "PostalCode": "5013",
        "Latitude": 35.625000,
        "Longitude": 10.754167
      },
      {
        "Name": "BENI HASSEN",
        "NameAr": "Ø¨Ù†ÙŠ Ø­Ø³Ø§Ù†",
        "Value": "BENI HASSEN",
        "PostalCode": "5014",
        "Latitude": 35.566667,
        "Longitude": 10.733333
      },
      {
        "Name": "SAYADA LAMTA BOU HAJAR",
        "NameAr": "ØµÙŠØ§Ø¯Ø© Ù„Ù…Ø·Ø© Ø¨ÙˆØ­Ø¬Ø±",
        "Value": "SAYADA LAMTA BOU HAJAR",
        "PostalCode": "5015",
        "Latitude": 35.666667,
        "Longitude": 10.883333
      },
      {
        "Name": "TEBOULBA",
        "NameAr": "Ø·Ø¨Ù„Ø¨Ø©",
        "Value": "TEBOULBA",
        "PostalCode": "5066",
        "Latitude": 35.640556,
        "Longitude": 10.961389
      },
      {
        "Name": "KSAR HELAL",
        "NameAr": "Ù‚ØµØ± Ù‡Ù„Ø§Ù„",
        "Value": "KSAR HELAL",
        "PostalCode": "5016",
        "Latitude": 35.644167,
        "Longitude": 10.892778
      },
      {
        "Name": "BEMBLA",
        "NameAr": "Ø¨Ù†Ø¨Ù„Ø©",
        "Value": "BEMBLA",
        "PostalCode": "5032",
        "Latitude": 35.700000,
        "Longitude": 10.783333
      },
      {
        "Name": "ZERAMDINE",
        "NameAr": "Ø²Ø±Ù…Ø¯ÙŠÙ†",
        "Value": "ZERAMDINE",
        "PostalCode": "5033",
        "Latitude": 35.583333,
        "Longitude": 10.700000
      },
      {
        "Name": "MOKNINE",
        "NameAr": "Ø§Ù„Ù…ÙƒÙ†ÙŠÙ†",
        "Value": "MOKNINE",
        "PostalCode": "5034",
        "Latitude": 35.630556,
        "Longitude": 10.900000
      },
      {
        "Name": "OUERDANINE",
        "NameAr": "Ø§Ù„ÙˆØ±Ø¯Ø§Ù†ÙŠÙ†",
        "Value": "OUERDANINE",
        "PostalCode": "5041",
        "Latitude": 35.783333,
        "Longitude": 10.683333
      },
      {
        "Name": "BEKALTA",
        "NameAr": "Ø§Ù„Ø¨Ù‚Ø§Ù„Ø·Ø©",
        "Value": "BEKALTA",
        "PostalCode": "5090",
        "Latitude": 35.616667,
        "Longitude": 11.033333
      }
    ]
  },
  {
    "Name": "NABEUL",
    "NameAr": "Ù†Ø§Ø¨Ù„",
    "Value": "NABEUL",
    "Delegations": [
      {
        "Name": "BENI KHIAR",
        "NameAr": "Ø¨Ù†ÙŠ Ø®ÙŠØ§Ø±",
        "Value": "BENI KHIAR",
        "PostalCode": "8023",
        "Latitude": 36.466667,
        "Longitude": 10.783333
      },
      {
        "Name": "TAKELSA",
        "NameAr": "ØªØ§ÙƒÙ„Ø³Ø©",
        "Value": "TAKELSA",
        "PostalCode": "8031",
        "Latitude": 36.783333,
        "Longitude": 10.633333
      },
      {
        "Name": "EL MIDA",
        "NameAr": "Ø§Ù„Ù…ÙŠØ¯Ø©",
        "Value": "EL MIDA",
        "PostalCode": "8044",
        "Latitude": 36.733333,
        "Longitude": 10.916667
      },
      {
        "Name": "MENZEL BOUZELFA",
        "NameAr": "Ù…Ù†Ø²Ù„ Ø¨ÙˆØ²Ù„ÙØ©",
        "Value": "MENZEL BOUZELFA",
        "PostalCode": "8010",
        "Latitude": 36.683333,
        "Longitude": 10.583333
      },
      {
        "Name": "KELIBIA",
        "NameAr": "Ù‚Ù„ÙŠØ¨ÙŠØ©",
        "Value": "KELIBIA",
        "PostalCode": "8090",
        "Latitude": 36.846111,
        "Longitude": 11.097500
      },
      {
        "Name": "HAMMAMET",
        "NameAr": "Ø§Ù„Ø­Ù…Ø§Ù…Ø§Øª",
        "Value": "HAMMAMET",
        "PostalCode": "8032",
        "Latitude": 36.400000,
        "Longitude": 10.616667
      },
      {
        "Name": "BOU ARGOUB",
        "NameAr": "Ø¨ÙˆØ¹Ø±Ù‚ÙˆØ¨",
        "Value": "BOU ARGOUB",
        "PostalCode": "8061",
        "Latitude": 36.550000,
        "Longitude": 10.550000
      },
      {
        "Name": "KORBA",
        "NameAr": "Ù‚Ø±Ø¨Ø©",
        "Value": "KORBA",
        "PostalCode": "8033",
        "Latitude": 36.575278,
        "Longitude": 10.862222
      },
      {
        "Name": "MENZEL TEMIME",
        "NameAr": "Ù…Ù†Ø²Ù„ ØªÙ…ÙŠÙ…",
        "Value": "MENZEL TEMIME",
        "PostalCode": "8034",
        "Latitude": 36.783333,
        "Longitude": 10.983333
      },
      {
        "Name": "NABEUL",
        "NameAr": "Ù†Ø§Ø¨Ù„",
        "Value": "NABEUL",
        "PostalCode": "8062",
        "Latitude": 36.456065,
        "Longitude": 10.734616
      },
      {
        "Name": "EL HAOUARIA",
        "NameAr": "Ø§Ù„Ù‡ÙˆØ§Ø±ÙŠØ©",
        "Value": "EL HAOUARIA",
        "PostalCode": "8036",
        "Latitude": 37.050000,
        "Longitude": 11.016667
      },
      {
        "Name": "HAMMAM EL GHEZAZ",
        "NameAr": "Ø­Ù…Ø§Ù… Ø§Ù„Ø£ØºØ²Ø§Ø²",
        "Value": "HAMMAM EL GHEZAZ",
        "PostalCode": "8025",
        "Latitude": 36.966667,
        "Longitude": 11.116667
      },
      {
        "Name": "SOLIMAN",
        "NameAr": "Ø³Ù„ÙŠÙ…Ø§Ù†",
        "Value": "SOLIMAN",
        "PostalCode": "8063",
        "Latitude": 36.700000,
        "Longitude": 10.483333
      },
      {
        "Name": "GROMBALIA",
        "NameAr": "Ù‚Ø±Ù…Ø¨Ø§Ù„ÙŠØ©",
        "Value": "GROMBALIA",
        "PostalCode": "8092",
        "Latitude": 36.600000,
        "Longitude": 10.500000
      },
      {
        "Name": "DAR CHAABANE ELFEHRI",
        "NameAr": "Ø¯Ø§Ø± Ø´Ø¹Ø¨Ø§Ù† Ø§Ù„ÙÙ‡Ø±ÙŠ",
        "Value": "DAR CHAABANE ELFEHRI",
        "PostalCode": "8011",
        "Latitude": 36.473333,
        "Longitude": 10.755833
      },
      {
        "Name": "BENI KHALLED",
        "NameAr": "Ø¨Ù†ÙŠ Ø®Ù„Ø§Ø¯",
        "Value": "BENI KHALLED",
        "PostalCode": "8099",
        "Latitude": 36.650000,
        "Longitude": 10.600000
      }
    ]
  },
  {
    "Name": "SFAX",
    "NameAr": "ØµÙØ§Ù‚Ø³",
    "Value": "SFAX",
    "Delegations": [
      {
        "Name": "AGAREB",
        "NameAr": "Ø¹Ù‚Ø§Ø±Ø¨",
        "Value": "AGAREB",
        "PostalCode": "3030",
        "Latitude": 34.733333,
        "Longitude": 10.516667
      },
      {
        "Name": "EL HENCHA",
        "NameAr": "Ø§Ù„Ø­Ù†Ø´Ø©",
        "Value": "EL HENCHA",
        "PostalCode": "3043",
        "Latitude": 35.233333,
        "Longitude": 10.600000
      },
      {
        "Name": "SFAX EST",
        "NameAr": "ØµÙØ§Ù‚Ø³ Ø§Ù„Ø´Ø±Ù‚ÙŠØ©",
        "Value": "SFAX EST",
        "PostalCode": "3064",
        "Latitude": 34.740000,
        "Longitude": 10.760000
      },
      {
        "Name": "SFAX SUD",
        "NameAr": "ØµÙØ§Ù‚Ø³ Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "SFAX SUD",
        "PostalCode": "3083",
        "Latitude": 34.740000,
        "Longitude": 10.760000
      },
      {
        "Name": "MAHRAS",
        "NameAr": "Ø§Ù„Ù…Ø­Ø±Ø³",
        "Value": "MAHRAS",
        "PostalCode": "3044",
        "Latitude": 34.527778,
        "Longitude": 10.505556
      },
      {
        "Name": "SFAX VILLE",
        "NameAr": "ØµÙØ§Ù‚Ø³ Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©",
        "Value": "SFAX VILLE",
        "PostalCode": "3065",
        "Latitude": 34.737500,
        "Longitude": 10.757778
      },
      {
        "Name": "EL AMRA",
        "NameAr": "Ø§Ù„Ø¹Ø§Ù…Ø±Ø©",
        "Value": "EL AMRA",
        "PostalCode": "3066",
        "Latitude": 34.900000,
        "Longitude": 10.616667
      },
      {
        "Name": "BIR ALI BEN KHELIFA",
        "NameAr": "Ø¨Ø¦Ø± Ø¹Ù„ÙŠ Ø¨Ù† Ø®Ù„ÙŠÙØ©",
        "Value": "BIR ALI BEN KHELIFA",
        "PostalCode": "3085",
        "Latitude": 34.833333,
        "Longitude": 10.066667
      },
      {
        "Name": "KERKENAH",
        "NameAr": "Ù‚Ø±Ù‚Ù†Ø©",
        "Value": "KERKENAH",
        "PostalCode": "3045",
        "Latitude": 34.720833,
        "Longitude": 11.150000
      },
      {
        "Name": "SAKIET EDDAIER",
        "NameAr": "Ø³Ø§Ù‚ÙŠØ© Ø§Ù„Ø¯Ø§ÙŠØ±",
        "Value": "SAKIET EDDAIER",
        "PostalCode": "3011",
        "Latitude": 34.816667,
        "Longitude": 10.766667
      },
      {
        "Name": "JEBENIANA",
        "NameAr": "Ø¬Ø¨Ù†ÙŠØ§Ù†Ø©",
        "Value": "JEBENIANA",
        "PostalCode": "3086",
        "Latitude": 35.033333,
        "Longitude": 10.900000
      },
      {
        "Name": "SAKIET EZZIT",
        "NameAr": "Ø³Ø§Ù‚ÙŠØ© Ø§Ù„Ø²ÙŠØª",
        "Value": "SAKIET EZZIT",
        "PostalCode": "3091",
        "Latitude": 34.794444,
        "Longitude": 10.743333
      },
      {
        "Name": "MENZEL CHAKER",
        "NameAr": "Ù…Ù†Ø²Ù„ Ø´Ø§ÙƒØ±",
        "Value": "MENZEL CHAKER",
        "PostalCode": "3092",
        "Latitude": 34.966667,
        "Longitude": 10.366667
      },
      {
        "Name": "ESSKHIRA",
        "NameAr": "Ø§Ù„ØµØ®ÙŠØ±Ø©",
        "Value": "ESSKHIRA",
        "PostalCode": "3050",
        "Latitude": 34.291667,
        "Longitude": 10.072222
      },
      {
        "Name": "GHRAIBA",
        "NameAr": "Ø§Ù„ØºØ±ÙŠØ¨Ø©",
        "Value": "GHRAIBA",
        "PostalCode": "3034",
        "Latitude": 34.550000,
        "Longitude": 10.166667
      }
    ]
  },
  {
    "Name": "SIDI BOUZID",
    "NameAr": "Ø³ÙŠØ¯ÙŠ Ø¨ÙˆØ²ÙŠØ¯",
    "Value": "SIDI_BOUZID",
    "Delegations": [
      {
        "Name": "MENZEL BOUZAIENE",
        "NameAr": "Ù…Ù†Ø²Ù„ Ø¨ÙˆØ²ÙŠØ§Ù†",
        "Value": "MENZEL BOUZAIENE",
        "PostalCode": "9114",
        "Latitude": 34.783333,
        "Longitude": 9.250000
      },
      {
        "Name": "SIDI BOUZID OUEST",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø¨ÙˆØ²ÙŠØ¯ Ø§Ù„ØºØ±Ø¨ÙŠØ©",
        "Value": "SIDI BOUZID OUEST",
        "PostalCode": "9131",
        "Latitude": 35.037222,
        "Longitude": 9.484722
      },
      {
        "Name": "BEN OUN",
        "NameAr": "Ø¨Ù† Ø¹ÙˆÙ†",
        "Value": "BEN OUN",
        "PostalCode": "9169",
        "Latitude": 34.866667,
        "Longitude": 9.066667
      },
      {
        "Name": "SIDI BOUZID EST",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø¨ÙˆØ²ÙŠØ¯ Ø§Ù„Ø´Ø±Ù‚ÙŠØ©",
        "Value": "SIDI BOUZID EST",
        "PostalCode": "9100",
        "Latitude": 35.037222,
        "Longitude": 9.484722
      },
      {
        "Name": "OULED HAFFOUZ",
        "NameAr": "Ø£ÙˆÙ„Ø§Ø¯ Ø­ÙÙˆØ²",
        "Value": "OULED HAFFOUZ",
        "PostalCode": "9180",
        "Latitude": 35.183333,
        "Longitude": 9.200000
      },
      {
        "Name": "REGUEB",
        "NameAr": "Ø§Ù„Ø±Ù‚Ø§Ø¨",
        "Value": "REGUEB",
        "PostalCode": "9115",
        "Latitude": 34.850000,
        "Longitude": 9.766667
      },
      {
        "Name": "MAKNASSY",
        "NameAr": "Ø§Ù„Ù…ÙƒÙ†Ø§Ø³ÙŠ",
        "Value": "MAKNASSY",
        "PostalCode": "9140",
        "Latitude": 34.600000,
        "Longitude": 9.600000
      },
      {
        "Name": "JILMA",
        "NameAr": "Ø¬Ù„Ù…Ø©",
        "Value": "JILMA",
        "PostalCode": "9110",
        "Latitude": 35.283333,
        "Longitude": 9.416667
      },
      {
        "Name": "SOUK JEDID",
        "NameAr": "Ø§Ù„Ø³ÙˆÙ‚ Ø§Ù„Ø¬Ø¯ÙŠØ¯",
        "Value": "SOUK JEDID",
        "PostalCode": "9121",
        "Latitude": 35.100000,
        "Longitude": 9.316667
      },
      {
        "Name": "MEZZOUNA",
        "NameAr": "Ø§Ù„Ù…Ø²ÙˆÙ†Ø©",
        "Value": "MEZZOUNA",
        "PostalCode": "9150",
        "Latitude": 34.516667,
        "Longitude": 9.833333
      },
      {
        "Name": "BIR EL HAFFEY",
        "NameAr": "Ø¨Ø¦Ø± Ø§Ù„Ø­ÙÙŠ",
        "Value": "BIR EL HAFFEY",
        "PostalCode": "9113",
        "Latitude": 34.933333,
        "Longitude": 9.200000
      },
      {
        "Name": "CEBBALA",
        "NameAr": "Ø§Ù„Ø³Ø¨Ø§Ù„Ø©",
        "Value": "CEBBALA",
        "PostalCode": "9122",
        "Latitude": 35.133333,
        "Longitude": 9.083333
      }
    ]
  },
  {
    "Name": "SILIANA",
    "NameAr": "Ø³Ù„ÙŠØ§Ù†Ø©",
    "Value": "SILIANA",
    "Delegations": [
      {
        "Name": "MAKTHAR",
        "NameAr": "Ù…ÙƒØ«Ø±",
        "Value": "MAKTHAR",
        "PostalCode": "6140",
        "Latitude": 35.850000,
        "Longitude": 9.200000
      },
      {
        "Name": "BOU ARADA",
        "NameAr": "Ø¨ÙˆØ¹Ø±Ø§Ø¯Ø©",
        "Value": "BOU ARADA",
        "PostalCode": "6180",
        "Latitude": 36.350000,
        "Longitude": 9.616667
      },
      {
        "Name": "SIDI BOU ROUIS",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø¨ÙˆØ±ÙˆÙŠØ³",
        "Value": "SIDI BOU ROUIS",
        "PostalCode": "6113",
        "Latitude": 36.116667,
        "Longitude": 9.333333
      },
      {
        "Name": "KESRA",
        "NameAr": "ÙƒØ³Ø±Ù‰",
        "Value": "KESRA",
        "PostalCode": "6114",
        "Latitude": 35.816667,
        "Longitude": 9.366667
      },
      {
        "Name": "BARGOU",
        "NameAr": "Ø¨Ø±Ù‚Ùˆ",
        "Value": "BARGOU",
        "PostalCode": "6115",
        "Latitude": 36.083333,
        "Longitude": 9.600000
      },
      {
        "Name": "EL AROUSSA",
        "NameAr": "Ø§Ù„Ø¹Ø±ÙˆØ³Ø©",
        "Value": "EL AROUSSA",
        "PostalCode": "6116",
        "Latitude": 36.350000,
        "Longitude": 9.383333
      },
      {
        "Name": "LE KRIB",
        "NameAr": "Ø§Ù„ÙƒØ±ÙŠØ¨",
        "Value": "LE KRIB",
        "PostalCode": "6120",
        "Latitude": 36.283333,
        "Longitude": 9.183333
      },
      {
        "Name": "SILIANA NORD",
        "NameAr": "Ø³Ù„ÙŠØ§Ù†Ø© Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "SILIANA NORD",
        "PostalCode": "6100",
        "Latitude": 36.084890,
        "Longitude": 9.370000
      },
      {
        "Name": "SILIANA SUD",
        "NameAr": "Ø³Ù„ÙŠØ§Ù†Ø© Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "SILIANA SUD",
        "PostalCode": "6143",
        "Latitude": 36.084890,
        "Longitude": 9.370000
      },
      {
        "Name": "ROHIA",
        "NameAr": "Ø§Ù„Ø±ÙˆØ­ÙŠØ©",
        "Value": "ROHIA",
        "PostalCode": "6150",
        "Latitude": 35.650000,
        "Longitude": 9.000000
      },
      {
        "Name": "GAAFOUR",
        "NameAr": "Ù‚Ø¹ÙÙˆØ±",
        "Value": "GAAFOUR",
        "PostalCode": "6121",
        "Latitude": 36.283333,
        "Longitude": 9.416667
      }
    ]
  },
  {
    "Name": "SOUSSE",
    "NameAr": "Ø³ÙˆØ³Ø©",
    "Value": "SOUSSE",
    "Delegations": [
      {
        "Name": "SIDI EL HENI",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø§Ù„Ù‡Ø§Ù†ÙŠ",
        "Value": "SIDI EL HENI",
        "PostalCode": "4026",
        "Latitude": 35.666667,
        "Longitude": 10.300000
      },
      {
        "Name": "SOUSSE JAOUHARA",
        "NameAr": "Ø³ÙˆØ³Ø© Ø¬ÙˆÙ‡Ø±Ø©",
        "Value": "SOUSSE JAOUHARA",
        "PostalCode": "4054",
        "Latitude": 35.825354,
        "Longitude": 10.607995
      },
      {
        "Name": "BOU FICHA",
        "NameAr": "Ø¨ÙˆÙÙŠØ´Ø©",
        "Value": "BOU FICHA",
        "PostalCode": "4010",
        "Latitude": 36.266667,
        "Longitude": 10.400000
      },
      {
        "Name": "SOUSSE VILLE",
        "NameAr": "Ø³ÙˆØ³Ø© Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©",
        "Value": "SOUSSE VILLE",
        "PostalCode": "4059",
        "Latitude": 35.828828,
        "Longitude": 10.640036
      },
      {
        "Name": "ENFIDHA",
        "NameAr": "Ø§Ù„Ù†ÙÙŠØ¶Ø©",
        "Value": "ENFIDHA",
        "PostalCode": "4030",
        "Latitude": 36.133333,
        "Longitude": 10.383333
      },
      {
        "Name": "KALAA EL KEBIRA",
        "NameAr": "Ø§Ù„Ù‚Ù„Ø¹Ø© Ø§Ù„ÙƒØ¨Ø±Ù‰",
        "Value": "KALAA EL KEBIRA",
        "PostalCode": "4060",
        "Latitude": 35.866667,
        "Longitude": 10.533333
      },
      {
        "Name": "HAMMAM SOUSSE",
        "NameAr": "Ø­Ù…Ø§Ù… Ø³ÙˆØ³Ø©",
        "Value": "HAMMAM SOUSSE",
        "PostalCode": "4011",
        "Latitude": 35.861111,
        "Longitude": 10.597222
      },
      {
        "Name": "HERGLA",
        "NameAr": "Ù‡Ø±Ù‚Ù„Ø©",
        "Value": "HERGLA",
        "PostalCode": "4012",
        "Latitude": 36.033333,
        "Longitude": 10.500000
      },
      {
        "Name": "MSAKEN",
        "NameAr": "Ù…Ø³Ø§ÙƒÙ†",
        "Value": "MSAKEN",
        "PostalCode": "4013",
        "Latitude": 35.729444,
        "Longitude": 10.580000
      },
      {
        "Name": "SOUSSE RIADH",
        "NameAr": "Ø³ÙˆØ³Ø© Ø§Ù„Ø±ÙŠØ§Ø¶",
        "Value": "SOUSSE RIADH",
        "PostalCode": "4081",
        "Latitude": 35.809444,
        "Longitude": 10.591667
      },
      {
        "Name": "KONDAR",
        "NameAr": "ÙƒÙ†Ø¯Ø§Ø±",
        "Value": "KONDAR",
        "PostalCode": "4020",
        "Latitude": 35.933333,
        "Longitude": 10.316667
      },
      {
        "Name": "SIDI BOU ALI",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø¨ÙˆØ¹Ù„ÙŠ",
        "Value": "SIDI BOU ALI",
        "PostalCode": "4040",
        "Latitude": 35.966667,
        "Longitude": 10.466667
      },
      {
        "Name": "KALAA ESSGHIRA",
        "NameAr": "Ø§Ù„Ù‚Ù„Ø¹Ø© Ø§Ù„ØµØºØ±Ù‰",
        "Value": "KALAA ESSGHIRA",
        "PostalCode": "4021",
        "Latitude": 35.833333,
        "Longitude": 10.566667
      },
      {
        "Name": "AKOUDA",
        "NameAr": "Ø£ÙƒÙˆØ¯Ø©",
        "Value": "AKOUDA",
        "PostalCode": "4022",
        "Latitude": 35.871111,
        "Longitude": 10.563889
      }
    ]
  },
  {
    "Name": "TATAOUINE",
    "NameAr": "ØªØ·Ø§ÙˆÙŠÙ†",
    "Value": "TATAOUINE",
    "Delegations": [
      {
        "Name": "TATAOUINE SUD",
        "NameAr": "ØªØ·Ø§ÙˆÙŠÙ† Ø§Ù„Ø¬Ù†ÙˆØ¨ÙŠØ©",
        "Value": "TATAOUINE SUD",
        "PostalCode": "3200",
        "Latitude": 32.929722,
        "Longitude": 10.451389
      },
      {
        "Name": "SMAR",
        "NameAr": "Ø§Ù„ØµÙ…Ø§Ø±",
        "Value": "SMAR",
        "PostalCode": "3223",
        "Latitude": 33.116667,
        "Longitude": 10.783333
      },
      {
        "Name": "BIR LAHMAR",
        "NameAr": "Ø¨Ø¦Ø± Ø§Ù„Ø£Ø­Ù…Ø±",
        "Value": "BIR LAHMAR",
        "PostalCode": "3212",
        "Latitude": 33.200000,
        "Longitude": 10.583333
      },
      {
        "Name": "GHOMRASSEN",
        "NameAr": "ØºÙ…Ø±Ø§Ø³Ù†",
        "Value": "GHOMRASSEN",
        "PostalCode": "3224",
        "Latitude": 33.050000,
        "Longitude": 10.333333
      },
      {
        "Name": "TATAOUINE NORD",
        "NameAr": "ØªØ·Ø§ÙˆÙŠÙ† Ø§Ù„Ø´Ù…Ø§Ù„ÙŠØ©",
        "Value": "TATAOUINE NORD",
        "PostalCode": "3233",
        "Latitude": 32.929722,
        "Longitude": 10.451389
      },
      {
        "Name": "REMADA",
        "NameAr": "Ø±Ù…Ø§Ø¯Ø©",
        "Value": "REMADA",
        "PostalCode": "3240",
        "Latitude": 32.300000,
        "Longitude": 10.383333
      },
      {
        "Name": "DHEHIBA",
        "NameAr": "Ø§Ù„Ø°Ù‡ÙŠØ¨Ø©",
        "Value": "DHEHIBA",
        "PostalCode": "3253",
        "Latitude": 32.000000,
        "Longitude": 10.700000
      }
    ]
  },
  {
    "Name": "TOZEUR",
    "NameAr": "ØªÙˆØ²Ø±",
    "Value": "TOZEUR",
    "Delegations": [
      {
        "Name": "DEGUECHE",
        "NameAr": "Ø¯Ù‚Ø§Ø´",
        "Value": "DEGUECHE",
        "PostalCode": "2261",
        "Latitude": 33.966667,
        "Longitude": 8.216667
      },
      {
        "Name": "TOZEUR",
        "NameAr": "ØªÙˆØ²Ø±",
        "Value": "TOZEUR",
        "PostalCode": "2200",
        "Latitude": 33.919722,
        "Longitude": 8.133611
      },
      {
        "Name": "TAMEGHZA",
        "NameAr": "ØªÙ…ØºØ²Ø©",
        "Value": "TAMEGHZA",
        "PostalCode": "2211",
        "Latitude": 34.383333,
        "Longitude": 7.933333
      },
      {
        "Name": "HEZOUA",
        "NameAr": "Ø­Ø²ÙˆØ©",
        "Value": "HEZOUA",
        "PostalCode": "2223",
        "Latitude": 33.750000,
        "Longitude": 7.833333
      },
      {
        "Name": "NEFTA",
        "NameAr": "Ù†ÙØ·Ø©",
        "Value": "NEFTA",
        "PostalCode": "2240",
        "Latitude": 33.873056,
        "Longitude": 7.883333
      }
    ]
  },
  {
    "Name": "TUNIS",
    "NameAr": "ØªÙˆÙ†Ø³",
    "Value": "TUNIS",
    "Delegations": [
      {
        "Name": "JEBEL JELLOUD",
        "NameAr": "Ø¬Ø¨Ù„ Ø§Ù„Ø¬Ù„ÙˆØ¯",
        "Value": "JEBEL JELLOUD",
        "PostalCode": "1046",
        "Latitude": 36.775000,
        "Longitude": 10.195833
      },
      {
        "Name": "CARTHAGE",
        "NameAr": "Ù‚Ø±Ø·Ø§Ø¬",
        "Value": "CARTHAGE",
        "PostalCode": "2016",
        "Latitude": 36.853611,
        "Longitude": 10.332222
      },
      {
        "Name": "LA MARSA",
        "NameAr": "Ø§Ù„Ù…Ø±Ø³Ù‰",
        "Value": "LA MARSA",
        "PostalCode": "2076",
        "Latitude": 36.877600,
        "Longitude": 10.327800
      },
      {
        "Name": "BAB BHAR",
        "NameAr": "Ø¨Ø§Ø¨ Ø¨Ø­Ø±",
        "Value": "BAB BHAR",
        "PostalCode": "1000",
        "Latitude": 36.798333,
        "Longitude": 10.180000
      },
      {
        "Name": "LA GOULETTE",
        "NameAr": "Ø­Ù„Ù‚ Ø§Ù„ÙˆØ§Ø¯ÙŠ",
        "Value": "LA GOULETTE",
        "PostalCode": "2060",
        "Latitude": 36.818889,
        "Longitude": 10.300000
      },
      {
        "Name": "LE BARDO",
        "NameAr": "Ø¨Ø§Ø±Ø¯Ùˆ",
        "Value": "LE BARDO",
        "PostalCode": "2017",
        "Latitude": 36.809278,
        "Longitude": 10.139500
      },
      {
        "Name": "LA MEDINA",
        "NameAr": "ØªÙˆÙ†Ø³ Ø§Ù„Ù…Ø¯ÙŠÙ†Ø©",
        "Value": "LA MEDINA",
        "PostalCode": "1000",
        "Latitude": 36.800000,
        "Longitude": 10.171667
      },
      {
        "Name": "EL MENZAH",
        "NameAr": "Ø§Ù„Ù…Ù†Ø²Ù‡",
        "Value": "EL MENZAH",
        "PostalCode": "2092",
        "Latitude": 36.845194,
        "Longitude": 10.176694
      },
      {
        "Name": "EL OMRANE SUPERIEUR",
        "NameAr": "Ø§Ù„Ø¹Ù…Ø±Ø§Ù† Ø§Ù„Ø£Ø¹Ù„Ù‰",
        "Value": "EL OMRANE SUPERIEUR",
        "PostalCode": "1064",
        "Latitude": 36.822500,
        "Longitude": 10.162222
      },
      {
        "Name": "CITE EL KHADRA",
        "NameAr": "Ø­ÙŠ Ø§Ù„Ø®Ø¶Ø±Ø§Ø¡",
        "Value": "CITE EL KHADRA",
        "PostalCode": "1002",
        "Latitude": 36.834300,
        "Longitude": 10.199000
      },
      {
        "Name": "EL HRAIRIA",
        "NameAr": "Ø§Ù„Ø­Ø±Ø§ÙŠØ±ÙŠØ©",
        "Value": "EL HRAIRIA",
        "PostalCode": "2051",
        "Latitude": 36.775278,
        "Longitude": 10.102778
      },
      {
        "Name": "EL KABBARIA",
        "NameAr": "Ø§Ù„ÙƒØ¨Ø§Ø±ÙŠØ©",
        "Value": "EL KABBARIA",
        "PostalCode": "1074",
        "Latitude": 36.766667,
        "Longitude": 10.175000
      },
      {
        "Name": "BAB SOUIKA",
        "NameAr": "Ø¨Ø§Ø¨ Ø³ÙˆÙŠÙ‚Ø©",
        "Value": "BAB SOUIKA",
        "PostalCode": "1075",
        "Latitude": 36.807500,
        "Longitude": 10.166944
      },
      {
        "Name": "EL OMRANE",
        "NameAr": "Ø§Ù„Ø¹Ù…Ø±Ø§Ù†",
        "Value": "EL OMRANE",
        "PostalCode": "1005",
        "Latitude": 36.820000,
        "Longitude": 10.155000
      },
      {
        "Name": "EZZOUHOUR  (TUNIS)",
        "NameAr": "Ø§Ù„Ø²Ù‡ÙˆØ± (ØªÙˆÙ†Ø³)",
        "Value": "EZZOUHOUR  (TUNIS)",
        "PostalCode": "2052",
        "Latitude": 36.788500,
        "Longitude": 10.129000
      },
      {
        "Name": "SIDI EL BECHIR",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø§Ù„Ø¨Ø´ÙŠØ±",
        "Value": "SIDI EL BECHIR",
        "PostalCode": "1089",
        "Latitude": 36.783333,
        "Longitude": 10.190000
      },
      {
        "Name": "SIDI HASSINE",
        "NameAr": "Ø³ÙŠØ¯ÙŠ Ø­Ø³ÙŠÙ†",
        "Value": "SIDI HASSINE",
        "PostalCode": "1095",
        "Latitude": 36.794444,
        "Longitude": 10.083333
      },
      {
        "Name": "EL KRAM",
        "NameAr": "Ø§Ù„ÙƒØ±Ù…",
        "Value": "EL KRAM",
        "PostalCode": "2089",
        "Latitude": 36.833333,
        "Longitude": 10.316667
      },
      {
        "Name": "ESSIJOUMI",
        "NameAr": "Ø§Ù„Ø³ÙŠØ¬ÙˆÙ…ÙŠ",
        "Value": "ESSIJOUMI",
        "PostalCode": "2072",
        "Latitude": 36.783333,
        "Longitude": 10.133333
      },
      {
        "Name": "ETTAHRIR",
        "NameAr": "Ø§Ù„ØªØ­Ø±ÙŠØ±",
        "Value": "ETTAHRIR",
        "PostalCode": "2042",
        "Latitude": 36.826111,
        "Longitude": 10.142778
      },
      {
        "Name": "EL OUERDIA",
        "NameAr": "Ø§Ù„ÙˆØ±Ø¯ÙŠØ©",
        "Value": "EL OUERDIA",
        "PostalCode": "1009",
        "Latitude": 36.772500,
        "Longitude": 10.185000
      }
    ]
  },
  {
    "Name": "ZAGHOUAN",
    "NameAr": "Ø²ØºÙˆØ§Ù†",
    "Value": "ZAGHOUAN",
    "Delegations": [
      {
        "Name": "ZAGHOUAN",
        "NameAr": "Ø²ØºÙˆØ§Ù†",
        "Value": "ZAGHOUAN",
        "PostalCode": "1100",
        "Latitude": 36.400000,
        "Longitude": 10.150000
      },
      {
        "Name": "ENNADHOUR",
        "NameAr": "Ø§Ù„Ù†Ø§Ø¸ÙˆØ±",
        "Value": "ENNADHOUR",
        "PostalCode": "1160",
        "Latitude": 36.216667,
        "Longitude": 10.066667
      },
      {
        "Name": "EL FAHS",
        "NameAr": "Ø§Ù„ÙØ­Øµ",
        "Value": "EL FAHS",
        "PostalCode": "1140",
        "Latitude": 36.376111,
        "Longitude": 9.904167
      },
      {
        "Name": "BIR MCHERGA",
        "NameAr": "Ø¨Ø¦Ø± Ù…Ø´Ø§Ø±Ù‚Ø©",
        "Value": "BIR MCHERGA",
        "PostalCode": "1111",
        "Latitude": 36.516667,
        "Longitude": 10.016667
      },
      {
        "Name": "HAMMAM ZRIBA",
        "NameAr": "Ø­Ù…Ø§Ù… Ø§Ù„Ø²Ø±ÙŠØ¨Ø©",
        "Value": "HAMMAM ZRIBA",
        "PostalCode": "1112",
        "Latitude": 36.300000,
        "Longitude": 10.216667
      },
      {
        "Name": "SAOUEF",
        "NameAr": "ØµÙˆØ§Ù",
        "Value": "SAOUEF",
        "PostalCode": "1115",
        "Latitude": 36.266667,
        "Longitude": 9.816667
      }
    ]
  }
]$$::jsonb AS j
),
gov_map AS (
  SELECT id, upper(trim(name)) AS gov_name_norm
  FROM governorates
),
flat AS (
  SELECT
    upper(trim(gov->>'Name')) AS gov_name_norm,
    trim(del->>'Name') AS place_name,
    lpad(regexp_replace(trim(del->>'PostalCode'), '\D', '', 'g'), 4, '0') AS code
  FROM raw
  CROSS JOIN LATERAL jsonb_array_elements(j) AS gov
  CROSS JOIN LATERAL jsonb_array_elements(gov->'Delegations') AS del
  WHERE coalesce(trim(del->>'PostalCode'),'') <> ''
    AND coalesce(trim(del->>'Name'),'') <> ''
),
dedup AS (
  SELECT DISTINCT ON (code)
    gov_name_norm,
    place_name,
    code
  FROM flat
  WHERE code ~ '^[0-9]{4}$'
  ORDER BY code, gov_name_norm, place_name
)
INSERT INTO postal_codes (governorate_id, code, place_name)
SELECT
  gm.id,
  d.code::char(4),
  d.place_name
FROM dedup d
JOIN gov_map gm ON gm.gov_name_norm = d.gov_name_norm
ON CONFLICT (code) DO UPDATE
SET governorate_id = EXCLUDED.governorate_id,
    place_name     = EXCLUDED.place_name;
-- =========================================================
-- DONNEES DE DEMARRAGE DOCKER
-- =========================================================
-- Comptes applicatifs minimaux et referentiels necessaires a l'interface.

INSERT INTO public.ref_appareil_fonctionnel (libelle, ordre) VALUES
  ('Signes Generaux', 1),
  ('Cardiovasculaire', 2),
  ('Dermatologique', 3),
  ('Digestif', 4),
  ('Genito-Urinaire', 5),
  ('Neuro-osteo-musculaire', 6),
  ('ORL', 7),
  ('Ophtalmologique', 8),
  ('Pleuro-Pulmonaire', 9),
  ('Psychiatrique', 10);

-- Mot de passe par defaut pour les 3 comptes: password
INSERT INTO public.users (nom, prenom, email, username, password, role, isactivated, must_change_password)
VALUES
  ('Admin', 'Systeme', 'admin@vih.tn', 'admin', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', true, false),
  ('Pharmacien', 'Demo', 'pharmacien@vih.tn', 'pharmacien.demo', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'pharmacien', true, false),
  ('Medecin', 'Demo', 'medecin@vih.tn', 'medecin.demo', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'medecin', true, false)
ON CONFLICT (email) DO UPDATE
SET
  nom = EXCLUDED.nom,
  prenom = EXCLUDED.prenom,
  username = EXCLUDED.username,
  password = EXCLUDED.password,
  role = EXCLUDED.role,
  isactivated = EXCLUDED.isactivated,
  must_change_password = EXCLUDED.must_change_password,
  updated_at = NOW();

WITH admin_user AS (
  SELECT id
  FROM public.users
  WHERE email = 'admin@vih.tn'
  LIMIT 1
)
INSERT INTO public.stock_medicaments (code, composition, quantite, dosage, created_by, updated_by)
SELECT s.code, s.composition, s.quantite, s.dosage, a.id, a.id
FROM (
  VALUES
    ('TLD', 'Tenofovir (TDF)/Lamivudine (3TC)/Doltegravir (DTG)', 100, NULL),
    ('AVONZA', 'Tenofovir (TDF)/Lamivudine (3TC)/Efavirenz (EFV)', 100, NULL),
    ('COMBIVIR', 'Zidovudine (AZT)/Lamivudine (3TC)', 100, NULL),
    ('REYATAZ/RITONAVIR', 'Atazanavir (ATV)/Ritonavir (RTV)', 100, NULL),
    ('KIVEXA', 'Abacavir (ABC)/Lamivudine (3TC)', 100, NULL),
    ('PREZISTA/RITONAVIR', 'Darunavir (DRV)/Ritonavir (RTV)', 100, NULL),
    ('TRUVADA', 'Tenofovir (TDF)/Emtricitabine (FTC)', 100, NULL),
    ('ZIAGEN', 'Abacavir (ABC)', 100, NULL),
    ('DTG', 'Dolutegravir (DTG)', 100, NULL)
) AS s(code, composition, quantite, dosage)
CROSS JOIN admin_user a
ON CONFLICT (code) DO NOTHING;

-- Les vues materialisees de BI sont creees WITH NO DATA dans le dump.
-- On les remplit une premiere fois pour rendre les endpoints BI utilisables apres le deploiement.
REFRESH MATERIALIZED VIEW public.mv_dim_population;
REFRESH MATERIALIZED VIEW public.mv_dim_statut_patient;
REFRESH MATERIALIZED VIEW public.mv_dim_statut_viral;
REFRESH MATERIALIZED VIEW public.mv_fait_nouveaux_malades;
REFRESH MATERIALIZED VIEW public.mv_fait_file_active;

