$bootstrap = <<-SCRIPT

echo "install dependancies"
sudo apt-get update
sudo apt-get install -y openjdk-8-jdk nodejs npm

echo "install cassandra"
wget https://mirror.netcologne.de/apache.org/cassandra/3.11.6/apache-cassandra-3.11.6-bin.tar.gz
tar -xzvf apache-cassandra-3.11.6-bin.tar.gz
mv apache-cassandra-3.11.6 /opt/cassandra
rm apache-cassandra-3.11.6-bin.tar.gz

# add rights to vagrant user for /opt folder
chown -R vagrant:vagrant /opt

# change default directory if it exists
[ -f /etc/profile ] || touch /etc/profile
echo '
[ ! -d /vagrant ] || cd /vagrant' | tee -a /etc/profile

SCRIPT

$startup = <<-SCRIPT

# start cassandra
# http://cassandra.apache.org/doc/latest/getting_started/installing.html
cd /opt/cassandra
./bin/cassandra -R

# start nodejs
cd /vagrant/server
npm install
# wait until cassandra is ready
while ! /opt/cassandra/bin/cqlsh -e 'describe cluster' ; do
    sleep 1
done
node index.js &
echo 'express server started'

SCRIPT

Vagrant.configure("2") do |config|

  config.vm.box = "bento/ubuntu-18.04"

  config.vm.provider "virtualbox" do |vb|
      vb.customize ["modifyvm", :id, "--memory", "8192"]
      vb.customize ["modifyvm", :id, "--cpus", "4"]
      vb.customize ["modifyvm", :id, "--uartmode1", "disconnected" ]
  end

  config.vm.network "private_network", ip: "192.168.18.101"
  config.vm.provision "shell", inline: $bootstrap
  config.vm.provision "shell", inline: $startup, run: 'always'

end
