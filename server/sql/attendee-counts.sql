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
WHERE starts_at > NOW()
GROUP BY
    run_events.id
ORDER BY run_events.starts_at ASC, run_events.id ASC
LIMIT 10 OFFSET $2;
