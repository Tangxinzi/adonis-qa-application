#!/bin/bash
strUsername="jiangkun"
strToken="f6fe94a2ad2aa310ab9ad0c57aad7f98"
installDir="/usr/local/flynat"
flynatc="sudo ${installDir}/flynatc"

usage()
{
	cat << EOT

Usage :  ${0} [OPTION] ...
  蜻蜓映射客户端管理脚本

Options:
  start     启动服务
  stop      关闭服务
  status    服务状态
  logs      查看客户端日志
  install   安装客户端
  uninstall 卸载客户端
EOT
}

stop() {
  ${flynatc} -s stop
  status
}

start() {
  ${flynatc} -s start
  status
}

logs() {
  tail -f "${installDir}/flynatc.log"
}

get_pid() {
  if [[ $(command -v pgrep) ]]; then
    pid=$(pgrep flynatc)
    echo $pid
  else
    pid=$(ps aux |grep "flynatc" |grep -v "grep" |awk '{print $2}')
    echo $pid
  fi

}


status() {
  pid=$(get_pid)
  if [[ ! -z $pid ]]
  then
    ${flynatc} -s status
    echo -e "\033[32m flynatc RUNNING pid $pid \033[0m"
  else
    echo -e "\033[31m flynatc STOP \033[0m"
  fi
}


# 设置开机自动启动
install() {
  ${flynatc} -s uninstall >/dev/null
  ${flynatc} -s install -u "${strUsername}" -k "${strToken}"
  ${flynatc} -s status
}

# 卸载客户端
uninstall() {
  ${flynatc} -s uninstall
}


while [[ true ]]; do
	case "$1" in
	  start )
      start
      exit 0
      ;;
    stop )
      stop
      exit 0
      ;;
    logs )
      logs
      exit 0
      ;;
    status )
      status
      exit 0
      ;;
    install)
      install
      exit 0
      ;;
    uninstall)
      uninstall
      exit 0
      ;;
    --help )
      usage
      exit 0
      ;;
    * )
      usage
      exit 1
      ;;
	esac
	if [[ $# == 0 ]]; then
		break
	fi
done