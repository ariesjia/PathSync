#! sh
app_name="PathSync"
  
# 创建app.nw文件
rm -rf output
cd ../ && rm -rf output && mkdir output
cp -r $app_name/src/* output
rm -rf output/Info.plist output/build.sh output/app.icns
cd output/
find . -type d -name ".svn" | xargs rm -rf
zip -r ../app.nw * > /dev/null;
rm -rf * && cd ../ && mv app.nw output/
mv output $app_name/ && cd $app_name
echo "create nw file success!"
  
#下载基础包
#svn co svn://localhost/node-webkit-base output > /dev/null

cd output
#创建mac版本app
cp -r /Users/twer/project/node-webkit/mac-os-x.zip mac-os-x.zip
unzip mac-os-x.zip -d mac-os-x
rm -rf mac-os-x.zip mac-os-x/nwsnapshot mac-os-x/credits.html
if [ -f ../Info.plist ];then
    cp ../Info.plist mac-os-x/node-webkit.app/Contents/
fi
cp app.nw mac-os-x/node-webkit.app/Contents/Resources/
if [ -f ../app.icns ];then
    cp ../app.icns mac-os-x/node-webkit.app/Contents/Resources/
fi
mv mac-os-x/node-webkit.app mac-os-x/$app_name.app
echo "create mac os app success!"
  
#创建windows版本app
cp -r /Users/twer/project/node-webkit/win-32.zip win-32.zip
unzip win-32.zip -d win-32
rm -rf win-32.zip win-32/nwsnapshot win-32/credits.html
cp app.nw win-32/ && cd win-32
cat nw.exe app.nw > $app_name.exe
rm -rf nw.exe nwsnapshot.exe
echo "create windows app success!"
cd ..

#删除app.nw
rm -f app.nw