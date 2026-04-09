git config --global user.name "FelipeCampos06"
    
git config --global user.email "felipe.belinati@gmail.com"

cd paste do arquivo

git init

git add .

git commit -m "data ou titulo do commit"

git remote add origin Link do git

git branch -M master

git push -u origin master

Caso dê erro use :

git remote remove origin
(depois cole o link do diretório dnv)

git pull origin master --rebase 
(dê o push em seguida)


cd backend

npm install

cd..

code .

copia o .env.example

e renomeia para .env

deixe assim

## Backend
PORT=3000
ENCRYPTION_KEY=sua_chave_de_criptografia_aqui_

## DB Config
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_DATABASE=quero_cafe_bar

depois iniciar o xamp no mysql

criar um schema e mudar o nome para o databse escrito acima

e depois de criado abra a pasta backend dnv no cmd

dê o comando 

cd backend

npm run start:dev

abra uma nova guia do cmd 

digite

curl http://localhost:3000

digite A

abra um outra gia do cmd

cd desktop

cd frontend-pamii

cd frontend

install npm

para rodar utilize 

npm run dev
