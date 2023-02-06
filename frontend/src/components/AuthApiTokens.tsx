import { format, formatDistanceToNow } from "date-fns";
import React, { FormEvent, useCallback, useMemo, useState } from "react";
import { ApiToken, NewApiToken } from "../api/entities/api-token";
import { useApiTokens } from "../hooks/use-api";
import { SpinnerIcon } from "../icons/Spinner";
import TrashcanIcon from "../icons/Trashcan";
import { Spinner } from "./ui/Spinner";

export const AuthApiTokens: React.FC = () => {
  const { apiTokens, isLoading, createToken, revokeToken } = useApiTokens();
  const sortedTokens = useMemo(
    () => apiTokens.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1)),
    [apiTokens],
  );

  return (
    <>
      <div className="flex justify-between">
        <p className="text-2xl font-normal">API Tokens</p>
      </div>
      <div className="shadow-xl bg-gray-100 dark:bg-gray-800 rounded p-4 m-2">
        <p className="mb-4">
          You can use API Tokens to access the Listory API directly. You can
          find the API docs{" "}
          <a href="/api/docs" target="_blank">
            here
          </a>
          .
        </p>
        <div className="mb-4">
          <NewTokenForm createToken={createToken} />
        </div>
        <div>
          <h3 className="text-xl">Manage Existing Tokens</h3>
          {isLoading && <Spinner className="m-8" />}
          {sortedTokens.length === 0 && (
            <div className="text-center m-4">
              <p className="">Could not find any api tokens!</p>
            </div>
          )}
          <div>
            {sortedTokens.length > 0 && (
              <div className="table-auto w-full">
                {sortedTokens.map((apiToken) => (
                  <ApiTokenItem
                    apiToken={apiToken}
                    revokeToken={revokeToken}
                    key={apiToken.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const NewTokenForm: React.FC<{
  createToken: (description: string) => Promise<NewApiToken>;
}> = ({ createToken }) => {
  const [newTokenDescription, setNewTokenDescription] = useState<string>("");
  const [newToken, setNewToken] = useState<NewApiToken | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [error, setError] = useState<Error | null>(null);

  const submitForm = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();

      setLoading(true);
      setError(null);

      try {
        const newToken = await createToken(newTokenDescription);
        setNewToken(newToken);
        setNewTokenDescription("");
      } catch (err: any) {
        setError(err);
      }

      setLoading(false);
    },
    [
      setLoading,
      setError,
      newTokenDescription,
      createToken,
      setNewToken,
      setNewTokenDescription,
    ],
  );

  return (
    <form>
      <h3 className="text-xl">Create New Token</h3>
      <label htmlFor="description" className="font-bold my-2 mr-2 block">
        Description
      </label>
      <input
        name="description"
        type="text"
        placeholder="Used for XYZ"
        value={newTokenDescription}
        onChange={(event) => setNewTokenDescription(event.target.value)}
        className="shadow appearance-none rounded w-1/3 mb-3 py-2 px-3 outline-none focus:ring ring-green-200 dark:ring-gray-600 bg-gray-200 dark:bg-gray-700"
      />
      <button
        className="hover:bg-gray-400 dark:hover:bg-gray-600 bg-gray-300 dark:bg-gray-700 font-bold py-2 px-4 rounded block"
        onClick={submitForm}
        disabled={isLoading}
      >
        {isLoading ? <Spinner /> : "Create"}
      </button>
      {newToken ? <NewApiTokenItem apiToken={newToken} /> : null}
    </form>
  );
};

const NewApiTokenItem: React.FC<{ apiToken: NewApiToken }> = ({ apiToken }) => {
  const copyToken = useCallback(() => {
    navigator.clipboard.writeText(apiToken.token);
  }, [apiToken]);

  return (
    <div className="bg-gray-200 dark:bg-gray-700 rounded-md p-2 my-4 w-min shadow-md">
      Your new API Token:
      <pre
        className="tracking-widest bg-gray-600 rounded-md p-4 my-2 cursor-pointer w-min shadow-lg text-gray-900"
        onClick={copyToken}
      >
        {apiToken.token}
      </pre>
      <span>The token will only be visible once, so make sure to save it!</span>
    </div>
  );
};

const ApiTokenItem: React.FC<{
  apiToken: ApiToken;
  revokeToken: (id: string) => Promise<void>;
}> = ({ apiToken, revokeToken }) => {
  const [isBeingRevoked, setIsBeingRevoked] = useState<boolean>(false);
  const revokeTokenButton = useCallback(async () => {
    setIsBeingRevoked(true);
    await revokeToken(apiToken.id);
    setIsBeingRevoked(false);
  }, [setIsBeingRevoked, revokeToken, apiToken]);

  const description = apiToken.description;
  const prefix = apiToken.prefix;
  const timeAgo = formatDistanceToNow(new Date(apiToken.createdAt), {
    addSuffix: true,
  });
  const dateTime = format(new Date(apiToken.createdAt), "PP p");

  const displayRevokeButton = apiToken.revokedAt == null && !isBeingRevoked;
  const displaySpinner = isBeingRevoked;

  return (
    <div className="hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700/25 md:flex md:justify-around px-2 py-2">
      <div className="md:w-1/2 font-bold">{description}</div>
      <div className="md:w-1/3">
        <span className="tracking-widest font-mono bg-gray-600 rounded-md px-2 text-gray-900">
          {prefix}...
        </span>
      </div>
      <div
        className="md:w-1/6 text-gray-500 font-extra-light text-sm"
        title={dateTime}
      >
        {timeAgo}
      </div>
      <div className="md:w-5 h-5 font-extra-light text-sm">
        {displayRevokeButton && (
          <button onClick={revokeTokenButton}>
            <TrashcanIcon className="h-5 w-5 fill-current" />
          </button>
        )}
        {displaySpinner && (
          <SpinnerIcon
            className={`h-5 w-5 text-gray-300 dark:text-gray-700 fill-green-500`}
          />
        )}
      </div>
    </div>
  );
};
