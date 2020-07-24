c:

cd C:\Program Files\MySQL\MySQL Server 8.0\bin

set "Ymd=%date:~,4%%date:~5,2%%date:~8,2%"

mysqldump -uroot -pPassword01! demo >>C:\Users\xiaohuhu\Desktop\SQL_Backup\kfp_%Ymd%.sql