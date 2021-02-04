---
title: CDH6集成Spark 3.0.1
date: 2020-12-24 15:28:05
permalink: /pages/2020/12/24/cdh6_spark3.0.1_intergration
categories: 
  - 大数据
  - 技术
tags: 
  - null
author: 
  name: cjjcsu
  link: https://github.com/cjjcsu
---

### 编译Spark源码

1. 下载源码

```
git clone https://github.com/apache/spark.git
#创建新分支
cd spark
git checkout -b v3.0.1-cdh6 v3.0.1
```
2. 修改pom.xml

```
# git diff pom.xml

--- a/pom.xml
+++ b/pom.xml
@@ -259,6 +259,14 @@
     <maven.build.timestamp.format>yyyy-MM-dd HH:mm:ss z</maven.build.timestamp.format>
   </properties>
   <repositories>
+    <repository>
+      <id>cloudera</id>
+      <url>https://repository.cloudera.com/artifactory/cloudera-repos/</url>
+      <name>Cloudera Repositories</name>
+      <snapshots>
+        <enabled>true</enabled>
+      </snapshots>
+  </repository>
     <repository>
       <id>gcs-maven-central-mirror</id>
       <!--
@@ -290,6 +298,11 @@
     </repository>
   </repositories>
   <pluginRepositories>
+    <pluginRepository>
+      <id>cloudera</id>
+      <name>Cloudera Repositories</name>
+      <url>https://repository.cloudera.com/artifactory/cloudera-repos/</url>
+  </pluginRepository>
     <pluginRepository>
       <id>gcs-maven-central-mirror</id>
       <!--
@@ -3009,6 +3022,12 @@
   </build>

   <profiles>
+    <profile>
+      <id>hadoop-3.0</id>
+      <properties>
+        <hadoop.version>3.0.0-cdh6.3.2</hadoop.version>
+      </properties>
+  </profile>
```

3. 编译打包

```
./dev/make-distribution.sh --name hadoop-3.0.0-cdh6.3.2  --tgz  -Phadoop-3.0 -Pyarn -Phive-thriftserver -DskipTests
```

### 与CHD6集成
1. 将上一步编译好的spark解压，我的目录是/opt/spark-3.0.1
2. 将hdfs、hive、yarn等相关配置文件拷贝到spark conf文件夹下

```
cp /etc/hive/conf/core-site.xml /etc/hive/conf/hdfs-site.xml /etc/hive/conf/hive-site.xml /etc/hive/conf/mapred-site.xml /etc/hive/conf/yarn-site.xml ./
```
3. 编辑spark-env.sh

```
cp spark-env.sh.template spark-env.sh
vim spark-env.sh

# 新增如下内容
export HADOOP_CONF_DIR=/etc/hadoop/conf
```
4. 编辑spark-defaults.xml

```
cp spark-defaults.conf.template spark-defaults.conf
vim spark-defaults.conf

# 新增如下内容
spark.sql.hive.metastore.version=2.1.1
spark.sql.hive.metastore.jars=/opt/cloudera/parcels/CDH/lib/hive/lib/*

spark.authenticate=false
spark.driver.log.dfsDir=/user/spark/driverLogs
spark.driver.log.persistToDfs.enabled=true
spark.dynamicAllocation.enabled=true
spark.dynamicAllocation.executorIdleTimeout=60
spark.dynamicAllocation.minExecutors=0
spark.dynamicAllocation.schedulerBacklogTimeout=1
spark.eventLog.enabled=true
spark.io.encryption.enabled=false
spark.network.crypto.enabled=false
spark.serializer=org.apache.spark.serializer.KryoSerializer
spark.shuffle.service.enabled=true
spark.shuffle.service.port=7337
spark.ui.enabled=true
spark.ui.killEnabled=true
spark.lineage.log.dir=/opt/var/log/spark/lineage
spark.lineage.enabled=true
spark.driver.extraClassPath=/usr/share/java/*
spark.executor.extraClassPath=/usr/share/java/*
spark.sql.crossJoin.enabled=true
spark.driver.extraJavaOptions=-Dfile.encoding=utf-8
spark.executor.extraJavaOptions=-Dfile.encoding=utf-8
spark.sql.adaptive.enabled=true
spark.sql.adaptive.join.enabled=true
spark.kryoserializer.buffer.max=256m
spark.master=yarn
spark.submit.deployMode=client
spark.eventLog.dir=hdfs://nameservice1/user/spark/applicationHistory
spark.yarn.historyServer.address=http://bigdata-master3.cai-inc.com:18088
spark.yarn.config.gatewayPath=/opt/cloudera/parcels
spark.yarn.historyServer.allowTracking=true
spark.yarn.appMasterEnv.MKL_NUM_THREADS=1
spark.executorEnv.MKL_NUM_THREADS=1
spark.yarn.appMasterEnv.OPENBLAS_NUM_THREADS=1
spark.executorEnv.OPENBLAS_NUM_THREADS=1
```
