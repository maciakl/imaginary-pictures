.PHONY: check, deploy, tunnel-deploy, build

default:
	@echo -e "Available options are:\n"
	@echo -e "\tcheck\t- to check for dependencies"
	@echo -e "\tdeploy\t- to deploy to host"

check:
	@command -v ssh >/dev/null 2>&1 || { echo "ERROR: please install ssh"; exit 1; }
	@command -v rsync >/dev/null 2>&1 || { echo "ERROR: please install rsync"; exit 1; }
	@[ -d "dist" ] || { echo "ERROR: Missing the dist folder."; exit 1; }

deploy: check
	rsync --compress --recursive --checksum --delete --itemize-changes dist/* maciakl@imaginary.pics:~/imaginary.pics/
