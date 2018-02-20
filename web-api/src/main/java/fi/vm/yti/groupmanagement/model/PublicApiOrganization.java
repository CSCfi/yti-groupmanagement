package fi.vm.yti.groupmanagement.model;

import java.util.Map;
import java.util.UUID;

public class PublicApiOrganization {

    private final UUID uuid;
    private final Map<String, String> prefLabel;
    private final Map<String, String> description;
    private final String url;
    private final boolean removed;

    public PublicApiOrganization(UUID uuid, Map<String, String> prefLabel, Map<String, String> description, String url, boolean removed) {
        this.uuid = uuid;
        this.prefLabel = prefLabel;
        this.description = description;
        this.url = url;
        this.removed = removed;
    }

    public UUID getUuid() {
        return uuid;
    }

    public Map<String, String> getPrefLabel() {
        return prefLabel;
    }

    public Map<String, String> getDescription() {
        return description;
    }

    public String getUrl() {
        return url;
    }

    public boolean getRemoved() {
        return removed;
    }
}