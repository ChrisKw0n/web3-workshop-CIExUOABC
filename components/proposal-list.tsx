"use client";

import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// ABI (Application Binary Interface) for interacting with the Ballot contract
const ballotAbi = [
  {
    inputs: [
      {
        internalType: "string[]",
        name: "proposalNames",
        type: "string[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
    ],
    name: "delegate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "proposals",
    outputs: [
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "uint256",
        name: "voteCount",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "proposal",
        type: "uint256",
      },
    ],
    name: "vote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "voters",
    outputs: [
      {
        internalType: "uint256",
        name: "weight",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "voted",
        type: "bool",
      },
      {
        internalType: "address",
        name: "delegate",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "vote",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "winnerName",
    outputs: [
      {
        internalType: "bytes32",
        name: "winnerName_",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "winningProposal",
    outputs: [
      {
        internalType: "uint256",
        name: "winningProposal_",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

// Contract address of the deployed Ballot contract
const BALLOT_CONTRACT_ADDRESS = "0x028Bbf361eEE890827988f737b56B8F8863E35ff";

// Define the structure of a Proposal
type Proposal = {
  id: number;
  title: string;
  description: string;
  voteCount: number;
  hasVoted: boolean;
};

// Props for the ProposalList component
interface ProposalListProps {
  walletAddress: string;
}

export function ProposalList({ walletAddress }: ProposalListProps) {
  // State variables to manage component data
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState<string>("");
  const { toast } = useToast();

  // Function to load proposals from the contract
  const loadProposals = async (userAddress: string) => {
    try {
      setLoading(true);

      if (!(window as any).ethereum || !userAddress) {
        setLoading(false);
        return;
      }

      // Create a provider and signer
      const providerInstance = new BrowserProvider((window as any).ethereum);
      setProvider(providerInstance);

      const signer = await providerInstance.getSigner();
      const ballotContract = new Contract(
        BALLOT_CONTRACT_ADDRESS,
        ballotAbi,
        signer
      );
      setContract(ballotContract);

      const proposalsData: Proposal[] = [];

      // Fetch proposals from the contract
      let proposalCount = 0;
      try {
        while (true) {
          await ballotContract.proposals(proposalCount);
          proposalCount++;
        }
      } catch (error) {
        console.log(`Found ${proposalCount} proposals`);
      }

      if (proposalCount === 0) {
        proposalCount = 5;
      }

      // Get voter details
      const voter = await ballotContract.voters(userAddress);
      const hasVoted = voter.voted;

      // Loop through proposals and add them to the state
      for (let i = 0; i < proposalCount; i++) {
        try {
          const proposal = await ballotContract.proposals(i);

          const nameHex = proposal.name;
          let name = "";

          for (let i = 0; i < nameHex.length; i += 2) {
            const charCode = parseInt(nameHex.substring(i, i + 2), 16);
            if (charCode !== 0) {
              name += String.fromCharCode(charCode);
            }
          }

          name = name.trim() || `Proposal ${i + 1}`;

          proposalsData.push({
            id: i,
            title: name,
            description: `Voting for proposal option: ${name}`,
            voteCount: Number(proposal.voteCount),
            hasVoted: hasVoted,
          });
        } catch (error) {
          break;
        }
      }

      setProposals(proposalsData);
      setIsConnected(true);
      setAccount(userAddress);

      const networkData = await providerInstance.getNetwork();
      const chainId = Number(networkData.chainId);

      setNetwork(networkData.name);
    } catch (error) {
      console.log("Error loading proposals:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (proposalId: number) => {
    if (!contract || !account) {
      return;
    }

    try {
      setIsVoting(true);

      const tx = await contract.vote(proposalId);

      await tx.wait();

      await loadProposals(account);
    } catch (error: any) {
      console.log("Error voting:", error);
      toast({
        title: "Error",
        description: `Execution error reason: ${error.reason}`,
      });
    } finally {
      setIsVoting(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      setAccount(walletAddress);
      loadProposals(walletAddress);
    } else {
      setIsConnected(false);
      setAccount("");
      setProposals([]);
      setContract(null);
      setProvider(null);
    }
  }, [walletAddress]);

  const calculateTotalVotes = () => {
    return proposals.reduce((sum, proposal) => sum + proposal.voteCount, 0);
  };

  const totalVotes = calculateTotalVotes();

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : proposals.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Proposals Found</CardTitle>
            <CardDescription>
              {isConnected
                ? "No active proposals were found in the contract."
                : "Connect your wallet to view proposals."}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-bold">
              Where is everyone coming from?
            </h2>
            <p className="text-gray-500">
              Cast your vote on one of the available options.
            </p>
          </div>

          {proposals.map((proposal) => (
            <Card key={proposal.id}>
              <CardHeader>
                <CardTitle>{proposal.title}</CardTitle>
                <CardDescription>{proposal.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Votes: {proposal.voteCount}</span>
                    <span>
                      Percentage:{" "}
                      {totalVotes > 0
                        ? ((proposal.voteCount / totalVotes) * 100).toFixed(1)
                        : 0}
                      %
                    </span>
                  </div>
                  <Progress
                    value={
                      totalVotes > 0
                        ? (proposal.voteCount / totalVotes) * 100
                        : 0
                    }
                  />
                  <div className="flex justify-center items-center">
                    <Button
                      onClick={() => handleVote(proposal.id)}
                      disabled={proposal.hasVoted || isVoting}
                      className="w-1/2"
                    >
                      {isVoting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Voting...
                        </>
                      ) : (
                        <>
                          <ThumbsUp className="mr-2 h-4 w-4" />
                          Vote
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Badge variant="outline">
                  {proposal.hasVoted
                    ? "You have already voted"
                    : "You have not voted yet"}
                </Badge>
              </CardFooter>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
