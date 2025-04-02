import pytest
from unittest.mock import MagicMock, patch
from motor.motor_asyncio import AsyncIOMotorClient
from app.tests_pre_start import init, logger


@pytest.mark.asyncio
async def test_init_successful_connection():
    """Test successful MongoDB database initialization."""
    # Create mock MongoDB client
    client_mock = MagicMock(spec=AsyncIOMotorClient)

    # Configure admin command mock to simulate successful ping
    admin_mock = MagicMock()
    command_mock = MagicMock(return_value={"ok": 1})  # MongoDB ping response
    admin_mock.configure_mock(**{"command.return_value": command_mock})
    client_mock.configure_mock(**{"admin": admin_mock})

    # Patch the MongoDB client and logger methods
    with (
        patch("motor.motor_asyncio.AsyncIOMotorClient", return_value=client_mock),
        patch.object(logger, "info") as mock_info,
        patch.object(logger, "error") as mock_error,
        patch.object(logger, "warn") as mock_warn,
    ):
        # Execute the initialization
        try:
            await init()
            connection_successful = True
        except Exception as e:
            connection_successful = False
            print(f"Connection failed: {e}")

        # Assertions
        assert (
            connection_successful
        ), "MongoDB connection should be successful without raising exceptions"

        # Verify MongoDB ping command was called
        admin_mock.command.assert_called_once_with("ping")

        # Verify client was properly closed
        client_mock.close.assert_called_once()

        # Verify appropriate logging
        mock_info.assert_called()
        mock_error.assert_not_called()
        mock_warn.assert_not_called()
