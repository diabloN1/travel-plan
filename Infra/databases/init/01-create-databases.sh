#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 \
    --username "$POSTGRES_USER" \
    --dbname "$POSTGRES_DB" \
    -v user_db_user="$USER_DB_USERNAME" \
    -v user_db_password="$USER_DB_PASSWORD" \
    -v travel_db_user="$TRAVEL_DB_USERNAME" \
    -v travel_db_password="$TRAVEL_DB_PASSWORD" \
    -v booking_db_user="$BOOKING_DB_USERNAME" \
    -v booking_db_password="$BOOKING_DB_PASSWORD" \
    -v payment_db_user="$PAYMENT_DB_USERNAME" \
    -v payment_db_password="$PAYMENT_DB_PASSWORD" <<'SQL'

CREATE ROLE :"user_db_user" LOGIN PASSWORD :'user_db_password';
CREATE DATABASE user_db OWNER :"user_db_user";

CREATE ROLE :"travel_db_user" LOGIN PASSWORD :'travel_db_password';
CREATE DATABASE travel_db OWNER :"travel_db_user";

CREATE ROLE :"booking_db_user" LOGIN PASSWORD :'booking_db_password';
CREATE DATABASE booking_db OWNER :"booking_db_user";

CREATE ROLE :"payment_db_user" LOGIN PASSWORD :'payment_db_password';
CREATE DATABASE payment_db OWNER :"payment_db_user";

SQL