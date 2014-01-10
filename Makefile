install:
	npm install
	bower install

release: install
	grunt release

package: release
	(cd dist && tar czf ../package.tgz *)

clean:
	rm -rf dist
	rm -f package.tgz
