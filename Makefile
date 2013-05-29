APP_DIR=external-apps
PRELOAD_URL=https://raw.github.com/yurenju/gaia-preload-app/master/preload.py
PRELOAD_FILE=preload.py

apps:
	curl $(PRELOAD_URL) -o $(APP_DIR)/$(PRELOAD_FILE)
	cd $(APP_DIR); \
	python $(CURDIR)/$(APP_DIR)/$(PRELOAD_FILE) $$line; \
	rm $(PRELOAD_FILE)

clean:
	rm $(APP_DIR)/$(PRELOAD_FILE)
