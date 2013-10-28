ig-pkg-polymer
==============

Polymer Package for Infragistics Web Designer

# To get set up using this with the Web Designer project..

1. Go to web-designer.
2. Run `git checkout package-simplifying` branch (after you pull latest). That branch should have this repo as a git submodule.  Then in that repo (`cd <web-designer-root>/modules/polymer` and run `git submodule init` and then `git submodule update` ([see here for more info](http://joncairns.com/2011/10/how-to-use-git-submodules/#cloning)).
3. Go to `cd <web-designer root>/modules/polymer` (where the repo should be added as a submodule).
4. Run `npm install`; this should get all package dependencies.
5. Run `grunt build`; this should prep your package for use.
6. Go to `cd ../..` to get back to parent repo of web-designer and run `grunt build`.  This should grab the aforementioned package and put it into the lib/packages dir, so it will be available along with the other packages currently under src/packages (both are mounted when running grunt server).
7. Run `grunt server` from the web-designer repo dir, and it should run, loading both packages in src/packages as well as any in lib/packages.  

You should now see the Polymer UI package in the IDE. You can work on both the web-designer and ig-pkg-polymer repos independently. Git treats submodules as their own repos. 

ig-pkg-polymer is just on master for now. As noted above, web-designer integration with it is on the package-simplifying branch.

# Q&A
Put your questions here, and I can answer them.
