SELECT
    run_events.*,
    COUNT(run_attendees.user_id) AS attendee_count,
    EXISTS (
        SELECT 1
        FROM run_attendees
        WHERE run_attendees.run_event_id = run_events.id
        AND run_attendees.user_id = $1
    ) AS is_joined
FROM run_events
LEFT JOIN run_attendees
    ON run_events.id = run_attendees.run_event_id
GROUP BY
    run_events.id;
