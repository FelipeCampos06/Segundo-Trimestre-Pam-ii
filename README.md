#   INICIAR O GITHUB    #

git config --global user.name "FelipeCampos06"
    
git config --global user.email "felipe.belinati@gmail.com"

cd paste do arquivo

git init

git add .

git commit -m "data ou titulo do commit"

git remote add origin https://github.com/FelipeCampos06/Segundo-Trimestre-Pam-ii

git branch -M master

git push -u origin master

Caso dê erro use :

git remote remove origin
(depois cole o link do diretório dnv)

git pull origin master --rebase 
(dê o push em seguida)


abra o cmd

#   BACKEND   #

cd backend

npm install

cd..

code .

copia o .env.example

e renomeia para .env

deixe assim

##Backend

PORT=3000
ENCRYPTION_KEY=sua_chave_de_criptografia_aqui_

##DB Config

DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=quero_cafe_bar

depois iniciar o xamp no mysql

abra o MySQL Worckbench

vá em schemas para criar um schema e mudar o nome para o databse escrito acima

e depois de criado abra a pasta backend dnv no cmd

dê o comando 

cd backend

npm run start:dev

#   INICIAR LOCALHOST   #

abra uma nova guia do cmd 

digite

curl http://localhost:3000

digite A

abra um outra gia do cmd

#   FRONTEND    #

cd desktop

cd frontend-pamii

cd frontend

install npm

para rodar utilize 

npm run dev

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