CREATE FUNCTION ignore_duplicates_entries() RETURNS Trigger
AS $$
BEGIN
    IF EXISTS (
        SELECT item_id FROM entries
        WHERE item_id = NEW.item_id
    ) THEN
        RETURN NULL;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER entries_ignore_duplicates
    BEFORE Insert ON entries
    FOR EACH ROW
    EXECUTE PROCEDURE ignore_duplicates_entries();
