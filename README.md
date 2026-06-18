#   INICIAR O GITHUB    #
cd desktop

git clone https://github.com/FelipeCampos06/Segundo-Trimestre-Pam-ii

git config --global user.name "FelipeCampos06"
    
git config --global user.email "felipe.belinati@gmail.com"

abra o cmd

PAT [Removido por segurança]

#   BACKEND  .env  #

cd backend

npm install

copia o .env.example

e renomeia para .env

deixe assim

##Backend

PORT=3000
ENCRYPTION_KEY=sua_chave_de_criptografia_aqui_1

##DB Config

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=quero_cafe_bar

depois iniciar o xamp no mysql

abra o MySQL Worckbench

CREATE SCHEMA quero_cafe_bar;

SELECT `usuarios`.`id`,
    `usuarios`.`nome`,
    `usuarios`.`usuario`,
    `usuarios`.`senha`,
    `usuarios`.`perfil`
    
FROM `quero_cafe_bar`.`usuarios`;

em seguida 

cd backend

npm run migrate

npm run start:dev

#   FRONTEND    #

cd..

cd frontend

cd frontend

npm install 

npm run dev

http://localhost:5173


Invoke-WebRequest -Uri 'http://localhost:3000/usuario' -Method Post -ContentType 'application/json' -Body '{"nome": "Usuario","usuario": "usuario","senha": "usuario"}'


#   INSTALAR OPENCODE   #

 npm install -g opencode-ai

 opencode

pegue a key da api

 /connect

 google

cole a api key

e de enter

# ANDROID STUDIO #

link de guia

https://ionicframework.com/docs/javascript/quickstart

npm install

npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/android

npx cap init

npm run build

npx cap add android

Após criar o add android use

npm run build

npx cap sync android

para rodar

npx cap open android
