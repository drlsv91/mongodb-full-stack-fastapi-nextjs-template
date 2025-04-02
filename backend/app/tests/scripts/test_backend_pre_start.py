from unittest.mock import MagicMock, patch
import pytest
from motor.motor_asyncio import AsyncIOMotorClient
from app.backend_pre_start import init, logger


@pytest.mark.asyncio
async def test_init_successful_connection() -> None:
    # Create mock MongoDB client
    client_mock = MagicMock(spec=AsyncIOMotorClient)

    # Configure admin command mock to simulate successful ping
    admin_mock = MagicMock()
    command_mock = MagicMock(return_value={"ok": 1})
    admin_mock.configure_mock(**{"command.return_value": command_mock})
    client_mock.configure_mock(**{"admin": admin_mock})

    with (
        patch("motor.motor_asyncio.AsyncIOMotorClient", return_value=client_mock),
        patch.object(logger, "info"),
        patch.object(logger, "error"),
        patch.object(logger, "warn"),
    ):
        try:
            await init()
            connection_successful = True
        except Exception:
            connection_successful = False

        assert (
            connection_successful
        ), "The MongoDB connection should be successful and not raise an exception."

        # Verify the ping command was called
        admin_mock.command.assert_called_once_with("ping")

        # Verify client was properly closed
        client_mock.close.assert_called_once()
